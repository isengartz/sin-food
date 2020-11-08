import request from 'supertest';
import mongoose from 'mongoose';
import * as faker from 'faker';
import { app } from '../../../app';
import {
  API_ROOT_ENDPOINT,
  RESTAURANT_CREATE_VALID_PAYLOAD,
} from '../../../utils/constants';
import { RestaurantCategory } from '../../../models/restaurant-category';

it('should return 401 when not logged in', async () => {
  await request(app)
    .delete(`${API_ROOT_ENDPOINT}/restaurants/asdasd`)
    .send({})
    .expect(401);
});

it('should return 401 when user is not admin', async () => {
  const { cookie } = await global.signin();
  await request(app)
    .delete(`${API_ROOT_ENDPOINT}/restaurants/asdasd`)
    .set('Cookie', cookie)
    .send({})
    .expect(401);
});

it('should return 404 when user does not exist', async () => {
  const { cookie } = await global.signinAdmin();
  await request(app)
    .delete(`${API_ROOT_ENDPOINT}/restaurants/${mongoose.Types.ObjectId()}`)
    .set('Cookie', cookie)
    .send({})
    .expect(404);
});

it('should return 204 on success', async () => {
  // Create new Restaurant
  const { user } = await global.signin();
  // Create new admin
  const { cookie } = await global.signinAdmin();

  // Send the request as Admin
  await request(app)
    .delete(`${API_ROOT_ENDPOINT}/restaurants/${user.id}`)
    .set('Cookie', cookie)
    .send({})
    .expect(204);
});

it('should remove the reference to restaurant from categories', async () => {
  const { cookie } = await global.signinAdmin();

  // Create new Category
  const {
    body: {
      data: { restaurant_categories },
    },
  } = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories`)
    .set('Cookie', cookie)
    .send({ name: 'Pizza' })
    .expect(201);

  // Register new restaurant with category
  const {
    body: {
      data: { user },
    },
  } = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants`)
    .send({
      ...RESTAURANT_CREATE_VALID_PAYLOAD,
      email: faker.internet.email(),
      name: faker.company.companyName(),
      categories: [restaurant_categories.id],
    })
    .expect(201);

  // Check the restaurant id attached to category
  const categoryBeforeDelete = await RestaurantCategory.findById(
    restaurant_categories.id,
  );
  expect(categoryBeforeDelete!.restaurants.length).toEqual(1);

  // Delete restaurant
  await request(app)
    .delete(`${API_ROOT_ENDPOINT}/restaurants/${user.id}`)
    .set('Cookie', cookie)
    .send({})
    .expect(204);

  // Check that restaurant got unattached from category
  const categoryAfterDelete = await RestaurantCategory.findById(
    restaurant_categories.id,
  );
  expect(categoryAfterDelete!.restaurants.length).toEqual(0);
});
