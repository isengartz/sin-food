import request from 'supertest';
import faker from 'faker';
import { Subjects, UserRole } from '@sin-nombre/sinfood-common';
import { app } from '../../../app';
import {
  API_ROOT_ENDPOINT,
  RESTAURANT_CREATE_VALID_PAYLOAD,
} from '../../../utils/constants';
import { RestaurantCategory } from '../../../models/restaurant-category';
import { natsWrapper } from '../../../events/nats-wrapper';

it('should return 400 when no required fields are set', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/`)
    .send({})
    .expect(400);
});

it('should return 400 when email already exist', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(201);

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(400);
});

it('should return 201 when payload is correct', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(201);
});

it('should set a cookie after successful signup', async () => {
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});

it('should create a user with admin privs', async () => {
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants`)
    .send({
      ...RESTAURANT_CREATE_VALID_PAYLOAD,
      role: UserRole.Admin,
      admin_passphrase: process.env.ADMIN_ALLOW_PASSWORD,
    })
    .expect(201);

  expect(response.body.data.user.role).toEqual(UserRole.Admin);
  expect(response.get('Set-Cookie')).toBeDefined();
});

it('should return 400 when passwords dont match', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/`)
    .send({
      ...RESTAURANT_CREATE_VALID_PAYLOAD,
      password_confirm: 'wrong_password',
    })
    .expect(400);
});

it('should attach restaurant category to restaurant and the inverse', async () => {
  const admin = await global.signinAdmin();
  // Create new Category as Admin
  const {
    body: {
      data: { restaurant_categories },
    },
  } = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories`)
    .set('Cookie', admin.cookie)
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

  // Category should be defined
  expect(user.categories.length).toEqual(1);
  expect(user.categories[0]).toEqual(restaurant_categories.id);

  // Restaurant Id should be attached to category
  const updatedCat = await RestaurantCategory.findById(
    restaurant_categories.id,
  );
  expect(updatedCat!.restaurants.length).toEqual(1);
  expect(updatedCat!.restaurants[0].toString()).toEqual(user.id.toString());
});

it('should successfully save working_hours', async () => {
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(201);
  expect(response.body.data.user.working_hours.length).toBeGreaterThan(0);
});

it('should successfully save holidays', async () => {
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(201);
  expect(response.body.data.user.holidays.length).toBeGreaterThan(0);
});

it('should emit an event', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;
  // The last Event should be RestaurantUpdated
  expect(eventsPublished[eventsPublished.length - 1][0]).toEqual(
    Subjects.RestaurantCreated,
  );
});
