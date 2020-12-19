import request from 'supertest';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';

it('should return 401 if user is not sign in', async () => {
  await request(app).get(`${API_ROOT_ENDPOINT}/orders`).send({}).expect(401);
});

it('should return 200 and a record if user role is user and owns the document ', async () => {
  const cookie = await global.signin();
  const payload = await global.createOrderPayload();
  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookie)
    .send(payload)
    .expect(201);
  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);
  expect(response.body.data.orders.length).toEqual(1);
});

it('should return 200 and no records if user role is user and does not own the document ', async () => {
  const cookie = await global.signin();
  const cookieTwo = await global.signin();
  const payload = await global.createOrderPayload();
  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookie)
    .send(payload)
    .expect(201);
  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookieTwo)
    .send({})
    .expect(200);
  expect(response.body.data.orders.length).toEqual(0);
});

it('should return 200 and a record if user role is Restaurant and owns the document ', async () => {
  const cookie = await global.signin();
  const payload = await global.createOrderPayload();

  // create the restaurant cookie with the payload restaurantId
  const cookieRestaurant = await global.signinRestaurant(payload.restaurantId);

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookie)
    .send(payload)
    .expect(201);
  // do the get request as the restaurant
  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookieRestaurant)
    .send({})
    .expect(200);
  expect(response.body.data.orders.length).toEqual(1);
});

it('should return 200 and no record if user role is Restaurant and does not own the document ', async () => {
  const cookie = await global.signin();
  const payload = await global.createOrderPayload();

  // just create a random restaurant cookie here
  const cookieRestaurant = await global.signinRestaurant();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookie)
    .send(payload)
    .expect(201);
  // do the get request as the restaurant
  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookieRestaurant)
    .send({})
    .expect(200);
  expect(response.body.data.orders.length).toEqual(0);
});

it('should return 200 and a record if user role is Admin', async () => {
  const cookie = await global.signin();
  const payload = await global.createOrderPayload();

  const cookieAdmin = await global.signinAdmin();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookie)
    .send(payload)
    .expect(201);

  // do the get request as the admin
  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/orders`)
    .set('Cookie', cookieAdmin)
    .send({})
    .expect(200);
  expect(response.body.data.orders.length).toEqual(1);
});
