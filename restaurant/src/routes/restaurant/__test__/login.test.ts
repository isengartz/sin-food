import request from 'supertest';
import { app } from '../../../app';
import {
  API_ROOT_ENDPOINT,
  RESTAURANT_CREATE_VALID_PAYLOAD,
} from '../../../utils/constants';

it('should return 400 when email doesnt exist in body ', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/signin`)
    .send({ email: 'test@test.com' })
    .expect(400);
});
it('should return 400 when password doesnt exist in body ', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/signin`)
    .send({ password: 'randomPassword' })
    .expect(400);
});
it('should return 404 when user not found ', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/signin`)
    .send({ email: 'test@test.com', password: 'randomPassword' })
    .expect(404);
});

it('should return 404 on wrong password ', async () => {
  await global.signin();
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/signin`)
    .send({
      email: RESTAURANT_CREATE_VALID_PAYLOAD.email,
      password: 'wrongPassword',
    })
    .expect(404);
});

it('should return 200 on success and a cookie defined ', async () => {
  await global.signin();
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/signin`)
    .send({
      email: RESTAURANT_CREATE_VALID_PAYLOAD.email,
      password: RESTAURANT_CREATE_VALID_PAYLOAD.password,
    })
    .expect(200);
  expect(response.get('Set-Cookie')).toBeDefined();
});
