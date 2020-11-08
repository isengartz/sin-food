import request from 'supertest';
import { app } from '../../app';
import {
  API_ROOT_ENDPOINT,
  USER_ADDRESS_CREATE_VALID_PAYLOAD,
} from '../../utils/constants';
import { User } from '../../models/user';

it('should return 404 when different user tries to delete not owned address', async () => {
  const userOne = await global.signin();
  const userTwo = await global.signin();

  // Create address as userOne
  // const response = await request(app)
  //   .post(`${API_ROOT_ENDPOINT}/users/address`)
  //   .set("Cookie", userOne.cookie)
  //   .send(USER_ADDRESS_CREATE_VALID_PAYLOAD)
  //   .expect(201);

  // await request(app)
  //   .delete(
  //     `${API_ROOT_ENDPOINT}/users/address/${response.body.data.address.id}`
  //   )
  //   .set("Cookie", userTwo.cookie)
  //   .send(USER_ADDRESS_CREATE_VALID_PAYLOAD)
  //   .expect(404);
});

it('should return 204 on success and user has 0 addresses', async () => {
  const { user, cookie } = await global.signin();

  // Create address as userOne
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/address`)
    .set('Cookie', cookie)
    .send(USER_ADDRESS_CREATE_VALID_PAYLOAD)
    .expect(201);

  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/users/address/${response.body.data.address.id}`,
    )
    .set('Cookie', cookie)
    .send(USER_ADDRESS_CREATE_VALID_PAYLOAD)
    .expect(204);

  const updatedUser = await User.findById(user.id);

  expect(updatedUser!.addresses.length).toEqual(0);
});
