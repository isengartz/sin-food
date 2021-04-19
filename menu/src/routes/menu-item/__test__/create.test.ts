import request from 'supertest';
import { Subjects } from '@sin-nombre/sinfood-common';
import { app } from '../../../app';
import {
  API_ROOT_ENDPOINT,
  MENU_ITEM_CREATE_VALID_PAYLOAD,
} from '../../../utils/constants';
import { natsWrapper } from '../../../events/nats-wrapper';

it('should return 401 if user is not logged in', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu`)
    .send(MENU_ITEM_CREATE_VALID_PAYLOAD)
    .expect(401);
});

it('should return 201 and change userId to currentUserId', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/`)
    .set('Cookie', cookie)
    .send(MENU_ITEM_CREATE_VALID_PAYLOAD)
    .expect(201);

  expect(response.body.data.menu_items.userId).not.toEqual('randomUserId');
});

it('should return 201 and userId to be equal to given one when user is admin', async () => {
  const cookie = global.signinAdmin();

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu`)
    .set('Cookie', cookie)
    .send({ ...MENU_ITEM_CREATE_VALID_PAYLOAD, userId: 'randomUserId' })
    .expect(201);

  expect(response.body.data.menu_items.userId).toEqual('randomUserId');
});

it('should return 400 when name is not defined', async () => {
  const cookie = global.signin();

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu`)
    .set('Cookie', cookie)
    .send({ userId: 'randomUserId' })
    .expect(400);
});

it('should return 400 when name already exist', async () => {
  const cookie = global.signin();

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu`)
    .set('Cookie', cookie)
    .send({ ...MENU_ITEM_CREATE_VALID_PAYLOAD, userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu`)
    .set('Cookie', cookie)
    .send({ ...MENU_ITEM_CREATE_VALID_PAYLOAD, userId: 'randomUserId' })
    .expect(400);
});

it('should return a full valid payload', async () => {
  const cookie = global.signin();

  // Create Ingredient Category
  const ingredientCategory = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/categories/`)
    .set('Cookie', cookie)
    .send({ name: 'meat', userId: 'randomUserId' })
    .expect(201);

  // Create Ingredients
  const ingredientBacon = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/`)
    .set('Cookie', cookie)
    .send({
      name: 'bacon',
      userId: 'randomUserId',
      category: ingredientCategory.body.data.ingredient_categories.id,
    })
    .expect(201);

  const ingredientHam = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/`)
    .set('Cookie', cookie)
    .send({
      name: 'Ham',
      userId: 'randomUserId',
      category: ingredientCategory.body.data.ingredient_categories.id,
    })
    .expect(201);

  // Create Menu Item Category

  const menuItemCategory = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/categories`)
    .set('Cookie', cookie)
    .send({
      name: 'Burgers',
      userId: 'randomUserId',
    })
    .expect(201);

  const variationsPayload = [
    {
      name: 'Small Size',
      price: 5,
    },
    {
      name: 'Big Size',
      price: 8,
    },
  ];

  const mainIngredientsPayload = [
    ingredientBacon.body.data.ingredients.id,
    ingredientHam.body.data.ingredients.id,
  ];

  const extraIngredientsGroupPayload = [
    {
      title: 'Add extra meat',
      ingredients: [
        ingredientBacon.body.data.ingredients.id,
        ingredientHam.body.data.ingredients.id,
      ],
    },
    {
      title: 'Add extra Cheese',
      ingredients: [
        // Should add new category and ingredients so FML xD
        ingredientBacon.body.data.ingredients.id,
        ingredientHam.body.data.ingredients.id,
      ],
    },
  ];

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/`)
    .set('Cookie', cookie)
    .send({
      name: 'Super Texas Burger',
      description: 'Amazing Burger or not !',
      userId: 'randomUserId',
      menu_category: menuItemCategory.body.data.menu_item_categories.id,
      base_price: 5,
      main_ingredients: mainIngredientsPayload,
      variations: variationsPayload,
      extra_ingredient_groups: extraIngredientsGroupPayload,
    })
    .expect(201);

  const {
    main_ingredients,
    variations,
    extra_ingredient_groups,
    menu_category,
  } = response.body.data.menu_items;

  // Some Expectations xD
  expect(main_ingredients.length).toEqual(2);
  expect(extra_ingredient_groups.length).toEqual(2);
  expect(variations.length).toEqual(2);
  expect(menu_category).toEqual(
    menuItemCategory.body.data.menu_item_categories.id,
  );
  expect(main_ingredients[0]).toEqual(ingredientBacon.body.data.ingredients.id);
  expect(extra_ingredient_groups[0].ingredients[0]).toEqual(
    ingredientBacon.body.data.ingredients.id,
  );
  expect(variations[0].name).toEqual('Small Size');
  expect(variations[1].name).toEqual('Big Size');

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;
  // The last Event should be MenuItemCreated
  expect(eventsPublished[eventsPublished.length - 1][0]).toEqual(
    Subjects.MenuItemCreated,
  );
});
