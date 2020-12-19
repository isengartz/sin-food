import request from 'supertest';
import { Subjects } from '@sin-nombre/sinfood-common';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';
import { natsWrapper } from '../../../events/nats-wrapper';

it('should return 401 if user is not logged in', async () => {
  const payload = await global.createOrderPayload();
  await request(app)
    .put(`${API_ROOT_ENDPOINT}/orders/randomOrderId`)
    .send({ ...payload, price: 5 })
    .expect(401);
});

it('should return 401 if user is a Restaurant', async () => {
  const restaurantCookie = await global.signinRestaurant();
  const payload = await global.createOrderPayload();
  await request(app)
    .put(`${API_ROOT_ENDPOINT}/orders/randomOrderId`)
    .set('Cookie', restaurantCookie)
    .send({ ...payload, price: 5 })
    .expect(401);
});

it('should return 201 when user role is user', async () => {
  const cookie = await global.signin();
  const payload = await global.createOrderPayload();
  await request(app)
    .put(`${API_ROOT_ENDPOINT}/orders/randomOrderId`)
    .set('Cookie', cookie)
    .send({ ...payload, price: 5 })
    .expect(401);
});

it('should return 201 when user role is admin', async () => {
  const cookie = await global.signinAdmin();
  const payload = await global.createOrderPayload();

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookie)
    .send(payload)
    .expect(201);

  const updateResponse = await request(app)
    .put(`${API_ROOT_ENDPOINT}/orders/${response.body.data.orders.id}`)
    .set('Cookie', cookie)
    .send({ ...payload, menu_items: payload.menu_items.slice(0, -1) }) // remove the last menu_item
    .expect(200);
  expect(updateResponse.body.data.orders.menu_items.length).toEqual(2);
});

it('should calculate the final price of the order correctly', async () => {
  const cookie = await global.signinAdmin();
  const payload = await global.createOrderPayload();

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookie)
    .send(payload)
    .expect(201);

  const updateResponse = await request(app)
    .put(`${API_ROOT_ENDPOINT}/orders/${response.body.data.orders.id}`)
    .set('Cookie', cookie)
    .send({ ...payload, menu_items: payload.menu_items.slice(0, -1) }) // remove the last menu_item
    .expect(200);
  // the last menu item cost 13 so 35 - 13 = 22
  expect(updateResponse.body.data.orders.price).toEqual(22);
});

it('should emit an OrderUpdated event', async () => {
  const cookie = await global.signinAdmin();
  const payload = await global.createOrderPayload();

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookie)
    .send(payload)
    .expect(201);

  await request(app)
    .put(`${API_ROOT_ENDPOINT}/orders/${response.body.data.orders.id}`)
    .set('Cookie', cookie)
    .send({ ...payload, menu_items: payload.menu_items.slice(0, -1) }) // remove the last menu_item
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;
  // The last Event should be OrderCreated
  expect(eventsPublished[eventsPublished.length - 1][0]).toEqual(
    Subjects.OrderUpdated,
  );
});
