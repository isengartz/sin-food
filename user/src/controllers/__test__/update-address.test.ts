import request from 'supertest';
import { app } from '../../app';

import {
  API_ROOT_ENDPOINT,
  USER_ADDRESS_CREATE_VALID_PAYLOAD,
} from '../../utils/constants';
import { User } from '../../models/user';

it('should return 401 when user not logged in', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/address/random_address_id`)
    .send(USER_ADDRESS_CREATE_VALID_PAYLOAD)
    .expect(401);
});
it('should return 400 on wrong address_id', async () => {
  const { cookie } = await global.signin();

   await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/address/random_address_id`)
    .set('Cookie', cookie)
    .send({})
    .expect(400);
});

it('should return 400 on missing required fields', async () => {
  // Create / get a cookie
  const { cookie } = await global.signin();

  // Create User Address
  const address = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/address`)
    .set('Cookie', cookie)
    .send(USER_ADDRESS_CREATE_VALID_PAYLOAD)
    .expect(201);

  // Send an update request with empty data
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/address/${address.body.data.address.id}`)
    .set('Cookie', cookie)
    .send({})
    .expect(400);

  // 3 are the required fields of UserAddress Model
  expect(response.body.errors.length).toEqual(3);
});

it("should return 400 when userAddress doesn't exist", async () => {
  const { cookie } = await global.signin();

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/address/random_address_id`)
    .set('Cookie', cookie)
    .send(USER_ADDRESS_CREATE_VALID_PAYLOAD)
    .expect(400);
});

it('should update the userAddress on success ', async () => {
  // Create / get a cookie
  const { cookie, user } = await global.signin();

  // Send a request to create userAddress for userTwo using the cookie from userOne
  const address = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/address`)
    .set('Cookie', cookie)
    .send(USER_ADDRESS_CREATE_VALID_PAYLOAD)
    .expect(201);

  USER_ADDRESS_CREATE_VALID_PAYLOAD.description = 'description changed';
  // Send a request to update userAddress
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/address/${address.body.data.address.id}`)
    .set('Cookie', cookie)
    .send(USER_ADDRESS_CREATE_VALID_PAYLOAD)
    .expect(200);

  // find the updated UserOne
  const updatedUser = await User.findById(user.id).populate('addresses');

  expect(updatedUser!.addresses[0].description).toEqual('description changed');
});
