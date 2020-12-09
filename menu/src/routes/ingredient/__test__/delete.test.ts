import request from 'supertest';
import mongoose from 'mongoose';
import { Subjects } from '@sin-nombre/sinfood-common';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';
import { natsWrapper } from '../../../events/nats-wrapper';

it('should return 401 if user is not logged in', async () => {
  await request(app)
    .delete(`${API_ROOT_ENDPOINT}/ingredients/${mongoose.Types.ObjectId()}`)
    .send({})
    .expect(401);
});

it('should return 404 when Document does not exist', async () => {
  const cookie = global.signin();
  await request(app)
    .delete(`${API_ROOT_ENDPOINT}/ingredients/${mongoose.Types.ObjectId()}`)
    .set('Cookie', cookie)
    .send({})
    .expect(404);
});

it('should return 401 when user does not own the Document ', async () => {
  const cookie = global.signin();
  const cookieTwo = global.signin();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients`)
    .set('Cookie', cookie)
    .send({ name: 'meat', userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/ingredients/${createResponse.body.data.ingredients.id}`,
    )
    .set('Cookie', cookieTwo)
    .send({})
    .expect(401);
});

it('should return 204 when user owns the Document but is Admin ', async () => {
  const cookie = global.signin();
  const cookieAdmin = global.signinAdmin();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients`)
    .set('Cookie', cookie)
    .send({ name: 'meat', userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/ingredients/${createResponse.body.data.ingredients.id}`,
    )
    .set('Cookie', cookieAdmin)
    .send({})
    .expect(204);
});

it('should return 204 when user own the Document ', async () => {
  const cookie = global.signin();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients`)
    .set('Cookie', cookie)
    .send({ name: 'meat', userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/ingredients/${createResponse.body.data.ingredients.id}`,
    )
    .set('Cookie', cookie)
    .send({})
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;
  // The 3rd from the end Event should be IngredientDeleted
  expect(eventsPublished[eventsPublished.length - 3][0]).toEqual(
    Subjects.IngredientDeleted,
  );
});

it('should detach ingredient from Menu_Item relationships', async () => {
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
    extra_ingredient_groups,
  } = response.body.data.menu_items;

  expect(main_ingredients.length).toEqual(2);
  expect(extra_ingredient_groups.length).toEqual(2);

  // Delete the Bacon ingredient
  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/ingredients/${ingredientBacon.body.data.ingredients.id}`,
    )
    .set('Cookie', cookie)
    .send({})
    .expect(204);

  // Reselect the menu item
  const updatedMenuItem = await request(app)
    .get(`${API_ROOT_ENDPOINT}/menu/${response.body.data.menu_items.id}`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  expect(updatedMenuItem.body.data.menu_items.main_ingredients.length).toEqual(
    1,
  );
  expect(
    updatedMenuItem.body.data.menu_items.extra_ingredient_groups[0].ingredients
      .length,
  ).toEqual(1);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;

  // The 3rd Event from the end should be Ingredient Deleted
  expect(eventsPublished[eventsPublished.length - 3][0]).toEqual(
    Subjects.IngredientDeleted,
  );
  expect(eventsPublished[eventsPublished.length - 1][0]).toEqual(
    Subjects.MenuItemUpdated,
  );
});
