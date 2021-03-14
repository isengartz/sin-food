import request from 'supertest';
import { app } from '../../app';
import {
  API_ROOT_ENDPOINT,
  USER_ADDRESS_CREATE_VALID_PAYLOAD,
} from '../../utils/constants';

it('should return users addresses when user is current user', async () => {
  const { cookie, user } = await global.signin();
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/address`)
    .set('Cookie', cookie)
    .send(USER_ADDRESS_CREATE_VALID_PAYLOAD)
    .expect(201);

  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users/${user.id}/address`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);
  expect(response.body.data.addresses.length).toEqual(1);
});

it('should swap userId when trying to get other users addresses', async () => {
  const user1 = await global.signin();
  const user2 = await global.signin();
  // Create an address as user1
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/address`)
    .set('Cookie', user1.cookie)
    .send(USER_ADDRESS_CREATE_VALID_PAYLOAD)
    .expect(201);

  // Try to receive it using user2 cookie
  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users/${user1.user.id}/address`)
    .set('Cookie', user2.cookie)
    .send({})
    .expect(200);

  // Should return user2 address which is null
  expect(response.body.data.addresses.length).toEqual(0);
});

it('should return users addresses when user requesting is an admin', async () => {
  const user1 = await global.signin();
  const admin = await global.signinAdmin();

  // Create an address as user1
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/address`)
    .set('Cookie', user1.cookie)
    .send(USER_ADDRESS_CREATE_VALID_PAYLOAD)
    .expect(201);

  // Try to receive it using user2 cookie
  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users/${user1.user.id}/address`)
    .set('Cookie', admin.cookie)
    .send({})
    .expect(200);

  // Should return users address
  expect(response.body.data.addresses.length).toEqual(1);
});
