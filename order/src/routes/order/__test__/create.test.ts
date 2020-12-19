import request from 'supertest';
import { Subjects } from '@sin-nombre/sinfood-common';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';
import { natsWrapper } from '../../../events/nats-wrapper';

it('should return 401 if user is not logged in', async () => {
  const payload = await global.createOrderPayload();
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/orders`)
    .send(payload)
    .expect(401);
});

it('should return 401 if user is a Restaurant', async () => {
  const restaurantCookie = await global.signinRestaurant();
  const payload = await global.createOrderPayload();
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', restaurantCookie)
    .send(payload)
    .expect(401);
});

it('should return 201 when user role is user', async () => {
  const cookie = await global.signin();
  const payload = await global.createOrderPayload();
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookie)
    .send(payload)
    .expect(201);
});

it('should return 201 when user role is admin', async () => {
  const cookie = await global.signinAdmin();
  const payload = await global.createOrderPayload();
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookie)
    .send(payload)
    .expect(201);
});

it('should calculate the final price of the order correctly', async () => {
  const cookie = await global.signin();
  const payload = await global.createOrderPayload();
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookie)
    .send(payload)
    .expect(201);

  // the createOrderPayload returns a payload which cost 35
  expect(response.body.data.orders.price).toEqual(35);
});

it('should emit an orderCreated event', async () => {
  const cookie = await global.signin();
  const payload = await global.createOrderPayload();
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookie)
    .send(payload)
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;
  // The last Event should be OrderCreated
  expect(eventsPublished[eventsPublished.length - 1][0]).toEqual(
    Subjects.OrderCreated,
  );
});
