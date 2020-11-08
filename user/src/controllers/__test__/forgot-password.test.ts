import request from 'supertest';
import { app } from '../../app';
import {
  API_ROOT_ENDPOINT,
  USER_CREATE_VALID_PAYLOAD,
} from '../../utils/constants';
import { User } from '../../models/user';
import { natsWrapper } from '../../events/nats-wrapper';

it('should return 404 when user doesnt exist', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/forgotPassword`)
    .send({})
    .expect(404);
});

it("should return 404 when email isn't defined ", async () => {
  await User.build(USER_CREATE_VALID_PAYLOAD).save();
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/forgotPassword`)
    .send({})
    .expect(404);
});

it('should return the password reset token on success', async () => {
  await User.build(USER_CREATE_VALID_PAYLOAD).save();
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/forgotPassword`)
    .send({ email: USER_CREATE_VALID_PAYLOAD.email })
    .expect(200);
  expect(response.body.data.resetToken).toBeDefined();
});

it('should publish an event for email sending', async () => {
  await User.build(USER_CREATE_VALID_PAYLOAD).save();
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/forgotPassword`)
    .send({ email: USER_CREATE_VALID_PAYLOAD.email })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
