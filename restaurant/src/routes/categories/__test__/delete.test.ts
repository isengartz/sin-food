import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import {
  API_ROOT_ENDPOINT,
  RESTAURANT_CREATE_VALID_PAYLOAD,
} from '../../../utils/constants';
import { Restaurant } from '../../../models/restaurant';
import { natsWrapper } from '../../../events/nats-wrapper';
import { Subjects } from '@sin-nombre/sinfood-common';

it('should return 401 when no logged in', async () => {
  await request(app)
    .delete(`${API_ROOT_ENDPOINT}/restaurants/categories/asd`)
    .send({})
    .expect(401);
});

it('should return 400 when bad id is provided', async () => {
  const { cookie } = await global.signinAdmin();
  await request(app)
    .delete(`${API_ROOT_ENDPOINT}/restaurants/categories/asd`)
    .set('Cookie', cookie)
    .send({})
    .expect(400);
});

it('should return 404 when category does not exist', async () => {
  const { cookie } = await global.signinAdmin();
  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/restaurants/categories/${mongoose.Types.ObjectId()}`,
    )
    .set('Cookie', cookie)
    .send({})
    .expect(404);
});

it('should return 204 on success', async () => {
  const { cookie } = await global.signinAdmin();

  const {
    body: {
      data: { restaurant_categories },
    },
  } = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories/`)
    .set('Cookie', cookie)
    .send({ name: 'Pizza' })
    .expect(201);

  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/restaurants/categories/${restaurant_categories.id}`,
    )
    .set('Cookie', cookie)
    .send({})
    .expect(204);
});

it('should remove reference from restaurant', async () => {
  const { cookie } = await global.signinAdmin();

  // create category
  const {
    body: {
      data: { restaurant_categories },
    },
  } = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories/`)
    .set('Cookie', cookie)
    .send({ name: 'Pizza' })
    .expect(201);

  // create user with category
  const {
    body: {
      data: { user },
    },
  } = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants`)
    .send({
      ...RESTAURANT_CREATE_VALID_PAYLOAD,
      categories: [restaurant_categories.id],
    })
    .expect(201);

  // Delete category
  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/restaurants/categories/${restaurant_categories.id}`,
    )
    .set('Cookie', cookie)
    .send({})
    .expect(204);

  const updatedUser = await Restaurant.findById(user.id);

  expect(updatedUser!.categories.length).toEqual(0);
});

it('should emit RestaurantUpdate events when deleting a category attached to a restaurant', async () => {
  const { cookie } = await global.signinAdmin();

  // create category
  const {
    body: {
      data: { restaurant_categories },
    },
  } = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories/`)
    .set('Cookie', cookie)
    .send({ name: 'Pizza' })
    .expect(201);

  // create user with category
  const {
    body: {
      data: { user },
    },
  } = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants`)
    .send({
      ...RESTAURANT_CREATE_VALID_PAYLOAD,
      categories: [restaurant_categories.id],
    })
    .expect(201);

  // Delete category
  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/restaurants/categories/${restaurant_categories.id}`,
    )
    .set('Cookie', cookie)
    .send({})
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;

  expect(eventsPublished[eventsPublished.length - 1][0]).toEqual(
    Subjects.RestaurantUpdated,
  );
});

it('should emit a RestaurantCategoryDeleted event', async () => {
  const { cookie } = await global.signinAdmin();

  const {
    body: {
      data: { restaurant_categories },
    },
  } = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories/`)
    .set('Cookie', cookie)
    .send({ name: 'Pizza' })
    .expect(201);

  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/restaurants/categories/${restaurant_categories.id}`,
    )
    .set('Cookie', cookie)
    .send({})
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;
  expect(eventsPublished[eventsPublished.length - 1][0]).toEqual(
    Subjects.RestaurantCategoryDeleted,
  );
});
