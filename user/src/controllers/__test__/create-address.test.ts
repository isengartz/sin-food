import request from 'supertest';
import { Subjects } from '@sin-nombre/sinfood-common';
import { app } from '../../app';
import {
  API_ROOT_ENDPOINT,
  USER_ADDRESS_CREATE_VALID_PAYLOAD,
} from '../../utils/constants';
import { User } from '../../models/user';
import { natsWrapper } from '../../events/nats-wrapper';

it('should return 401 when user not logged in', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/address`)
    .send(USER_ADDRESS_CREATE_VALID_PAYLOAD)
    .expect(401);
});
it('should return 400 when required fields missing', async () => {
  const { cookie } = await global.signin();

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/address`)
    .set('Cookie', cookie)
    .send({})
    .expect(400);

  // 3 are the required fields of UserAddress Model
  expect(response.body.errors.length).toEqual(3);
});
it('should attach the userAddress  ', async () => {
  // Create / get a cookie
  const { cookie, user } = await global.signin();

  // Send a request to create userAddress for userTwo using the cookie from userOne
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/address`)
    .set('Cookie', cookie)
    .send(USER_ADDRESS_CREATE_VALID_PAYLOAD)
    .expect(201);
  // find the updated UserOne
  const updatedUser = await User.findById(user.id);
  expect(updatedUser!.addresses.length).toEqual(1);
});

it('should publish an event', async () => {
  const { cookie, user } = await global.signin();

  // Send a request to create userAddress for userTwo using the cookie from userOne
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/address`)
    .set('Cookie', cookie)
    .send(USER_ADDRESS_CREATE_VALID_PAYLOAD)
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;
  // The last Event should be UserAddressCreated
  expect(eventsPublished[eventsPublished.length - 1][0]).toEqual(
    Subjects.UserAddressCreated,
  );
});
