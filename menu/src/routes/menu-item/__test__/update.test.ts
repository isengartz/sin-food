import request from 'supertest';
import mongoose from 'mongoose';
import { Subjects } from '@sin-nombre/sinfood-common';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';
import { natsWrapper } from '../../../events/nats-wrapper';
import { MenuItemCategory } from '../../../models/menu-item-category';
import { MenuItem } from '../../../models/menu-item';

it('should return 401 if user is not logged in', async () => {
  await request(app)
    .put(`${API_ROOT_ENDPOINT}/menu/${mongoose.Types.ObjectId()}`)
    .send({ name: 'meat' })
    .expect(401);
});

it('should return 401 when user does not own the Document', async () => {
  const cookie = global.signin();
  const cookieTwo = global.signin();

  const category = await MenuItemCategory.build({
    userId: 'randomUserId',
    name: 'Burgers',
  }).save();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/`)
    .set('Cookie', cookie)
    .send({
      name: 'Super Burger',
      userId: 'randomUserId',
      menu_category: category.id,
      base_price: 5,
    })
    .expect(201);

  await request(app)
    .put(`${API_ROOT_ENDPOINT}/menu/${createResponse.body.data.menu_items.id}`)
    .set('Cookie', cookieTwo)
    .send({ base_price: 6 })
    .expect(401);
});

it('should return 200 when user is admin', async () => {
  const cookie = global.signin();
  const cookieAdmin = global.signinAdmin();

  const category = await MenuItemCategory.build({
    userId: 'randomUserId',
    name: 'Burgers',
  }).save();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/`)
    .set('Cookie', cookie)
    .send({
      name: 'Super Burger',
      userId: 'randomUserId',
      menu_category: category.id,
      base_price: 5,
    })
    .expect(201);

  await request(app)
    .put(`${API_ROOT_ENDPOINT}/menu/${createResponse.body.data.menu_items.id}`)
    .set('Cookie', cookieAdmin)
    .send({ base_price: 6 })
    .expect(200);

  const updatedMenu = await MenuItem.findById(
    createResponse.body.data.menu_items.id,
  );
  expect(updatedMenu!.base_price).toEqual(6);
});

it('should return 200 when the user owns the document', async () => {
  const cookie = global.signin();

  const category = await MenuItemCategory.build({
    userId: 'randomUserId',
    name: 'Burgers',
  }).save();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/`)
    .set('Cookie', cookie)
    .send({
      name: 'Super Burger',
      userId: 'randomUserId',
      menu_category: category.id,
      base_price: 5,
    })
    .expect(201);

  await request(app)
    .put(`${API_ROOT_ENDPOINT}/menu/${createResponse.body.data.menu_items.id}`)
    .set('Cookie', cookie)
    .send({ base_price: 6 })
    .expect(200);

  const updatedMenu = await MenuItem.findById(
    createResponse.body.data.menu_items.id,
  );
  expect(updatedMenu!.base_price).toEqual(6);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;
  // The last Event should be MenuItemUpdated
  expect(eventsPublished[eventsPublished.length - 1][0]).toEqual(
    Subjects.MenuItemUpdated,
  );
});

it('should return 404 when document does not exist', async () => {
  const cookie = global.signin();

  await request(app)
    .put(`${API_ROOT_ENDPOINT}/menu/${mongoose.Types.ObjectId()}`)
    .set('Cookie', cookie)
    .send({
      name: 'Burger Edited',
    })
    .expect(404);
});

it('should return 200 with a full valid payload', async () => {
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
    .post(`${API_ROOT_ENDPOINT}/menu`)
    .set('Cookie', cookie)
    .send({
      name: 'Super Texas Burger',
      description: 'Amazing Burger or not !',
      userId: 'randomUserId',
      menu_category: menuItemCategory.body.data.menu_item_categories.id,
      base_price: 6,
      main_ingredients: mainIngredientsPayload,
      variations: variationsPayload,
      extra_ingredient_groups: extraIngredientsGroupPayload,
    })
    .expect(201);

  // Update
  const updateResponse = await request(app)
    .put(`${API_ROOT_ENDPOINT}/menu/${response.body.data.menu_items.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'Updated Burger',
      description: 'Amazing Burger or not !',
      userId: 'randomUserId',
      base_price: 7,
      main_ingredients: [ingredientBacon.body.data.ingredients.id],
      variations: [
        {
          name: 'Medium Size',
          price: 7,
        },
      ],
      extra_ingredient_groups: [
        {
          title: 'Add extra meat',
          ingredients: [
            ingredientBacon.body.data.ingredients.id,
            ingredientHam.body.data.ingredients.id,
          ],
        },
      ],
    })
    .expect(200);

  const {
    main_ingredients,
    variations,
    extra_ingredient_groups,
    menu_category,
  } = updateResponse.body.data.menu_items;

  expect(main_ingredients.length).toEqual(1);
  expect(extra_ingredient_groups.length).toEqual(1);
  expect(variations.length).toEqual(1);
  expect(menu_category).toEqual(
    menuItemCategory.body.data.menu_item_categories.id,
  );
  expect(main_ingredients[0]).toEqual(ingredientBacon.body.data.ingredients.id);
  expect(extra_ingredient_groups[0].ingredients[0]).toEqual(
    ingredientBacon.body.data.ingredients.id,
  );
  expect(variations[0].name).toEqual('Medium Size');

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;
  // The last Event should be MenuItemCreated
  expect(eventsPublished[eventsPublished.length - 1][0]).toEqual(
    Subjects.MenuItemUpdated,
  );
});
