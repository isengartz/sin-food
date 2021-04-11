import request from 'supertest';
import * as faker from 'faker';
import { Subjects } from '@sin-nombre/sinfood-common';
import { app } from '../../../app';
import {
  API_ROOT_ENDPOINT,
  RESTAURANT_CREATE_VALID_PAYLOAD,
} from '../../../utils/constants';
import { Restaurant } from '../../../models/restaurant';
import { RestaurantCategory } from '../../../models/restaurant-category';
import { natsWrapper } from '../../../events/nats-wrapper';

it('should return 401 when user isnt logged in', async () => {
  await request(app)
    .put(`${API_ROOT_ENDPOINT}/restaurants/randomid`)
    .send({ name: 'New Name' })
    .expect(401);
});

it('should swap the id to restaurants id when user is not admin', async () => {
  const updatedPayload = {
    ...RESTAURANT_CREATE_VALID_PAYLOAD,
    name: 'NEW NAME',
  };

  // Create new User
  const { user, cookie } = await global.signin();

  // send the payload using the 2nd users
  await request(app)
    .put(`${API_ROOT_ENDPOINT}/restaurants/asdasd`)
    .set('Cookie', cookie)
    .send(updatedPayload)
    .expect(200);

  // Expect the update to be a success as the id should swap to current user
  const updatedUser = await Restaurant.findById(user.id);
  expect(updatedUser!.name).toEqual('NEW NAME');
});

it('should add reference to category on update', async () => {
  const { cookie } = await global.signinAdmin();
  const restaurant = await global.signin();

  // Create 2 categories
  const pizza = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories`)
    .set('Cookie', cookie)
    .send({ name: 'Pizza' })
    .expect(201);
  const pasta = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories`)
    .set('Cookie', cookie)
    .send({ name: 'Pasta' })
    .expect(201);

  // Update the restaurant and add categories
  const {
    body: {
      data: { user },
    },
  } = await request(app)
    .put(`${API_ROOT_ENDPOINT}/restaurants/${restaurant.user.id}`)
    .set('Cookie', cookie)
    .send({
      ...RESTAURANT_CREATE_VALID_PAYLOAD,
      name: faker.company.companyName(),
      categories: [
        pasta.body.data.restaurant_categories.id,
        pizza.body.data.restaurant_categories.id,
      ],
    })
    .expect(200);

  const updatedPasta = await RestaurantCategory.findById(
    pasta.body.data.restaurant_categories.id,
  );
  const updatedPizza = await RestaurantCategory.findById(
    pizza.body.data.restaurant_categories.id,
  );

  // Both of them should have the id of restaurant attached
  expect(updatedPasta!.restaurants[0].toString()).toEqual(user.id.toString());
  expect(updatedPizza!.restaurants[0].toString()).toEqual(user.id.toString());
});

it('should remove the reference to category on update', async () => {
  const { cookie } = await global.signinAdmin();

  // Create 2 categories
  const pizza = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories`)
    .set('Cookie', cookie)
    .send({ name: 'Pizza' })
    .expect(201);
  const pasta = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories`)
    .set('Cookie', cookie)
    .send({ name: 'Pasta' })
    .expect(201);

  // Register new restaurant with category
  const {
    body: {
      data: { user },
    },
  } = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/`)
    .send({
      ...RESTAURANT_CREATE_VALID_PAYLOAD,
      email: faker.internet.email(),
      name: faker.company.companyName(),
      categories: [
        pasta.body.data.restaurant_categories.id,
        pizza.body.data.restaurant_categories.id,
      ],
    })
    .expect(201);

  // Update and remove Pasta from Categories
  await request(app)
    .put(`${API_ROOT_ENDPOINT}/restaurants/${user.id}`)
    .set('Cookie', cookie)
    .send({
      ...RESTAURANT_CREATE_VALID_PAYLOAD,
      name: faker.company.companyName(),
      categories: [pizza.body.data.restaurant_categories.id],
    })
    .expect(200);

  const updatedPasta = await RestaurantCategory.findById(
    pasta.body.data.restaurant_categories.id,
  );
  const updatedPizza = await RestaurantCategory.findById(
    pizza.body.data.restaurant_categories.id,
  );

  // Paste should have the reference removed
  expect(updatedPasta!.restaurants.length).toEqual(0);
  // Pizza should be unchanged
  expect(updatedPizza!.restaurants[0].toString()).toEqual(user.id.toString());
});

it('should publish an event', async () => {
  const { cookie } = await global.signinAdmin();
  const restaurant = await global.signin();

  // Create 2 categories
  const pizza = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories`)
    .set('Cookie', cookie)
    .send({ name: 'Pizza' })
    .expect(201);
  const pasta = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories`)
    .set('Cookie', cookie)
    .send({ name: 'Pasta' })
    .expect(201);

  // Update the restaurant and add categories
  await request(app)
    .put(`${API_ROOT_ENDPOINT}/restaurants/${restaurant.user.id}`)
    .set('Cookie', cookie)
    .send({
      ...RESTAURANT_CREATE_VALID_PAYLOAD,
      name: faker.company.companyName(),
      categories: [
        pasta.body.data.restaurant_categories.id,
        pizza.body.data.restaurant_categories.id,
      ],
    })
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;
  // The last Event should be RestaurantUpdated
  expect(eventsPublished[eventsPublished.length - 1][0]).toEqual(
    Subjects.RestaurantUpdated,
  );
});
