import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';

it('should return 200 and no payload when there is not one', async () => {
  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/menu/${mongoose.Types.ObjectId()}`)
    .send({})
    .expect(200);
  expect(response.body.data.menu_items).toEqual(null);
});

it('should return 200 and the payload when there is one', async () => {
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

  const responseGet = await request(app)
    .get(`${API_ROOT_ENDPOINT}/menu/${response.body.data.menu_items.id}`)
    .send({})
    .expect(200);
  expect(responseGet.body.data.menu_items).not.toEqual(null);
});
