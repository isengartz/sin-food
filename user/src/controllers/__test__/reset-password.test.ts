import request from 'supertest';
import { app } from '../../app';
import {
  API_ROOT_ENDPOINT,
  USER_CREATE_VALID_PAYLOAD,
} from '../../utils/constants';
import { User } from '../../models/user';

it('should return 400 when password or password_confirm is not defined', async () => {
  await request(app)
    .patch(`${API_ROOT_ENDPOINT}/users/resetPassword/testToken`)
    .send({})
    .expect(400);
});

it('should return 404 when token is invalid', async () => {
  await request(app)
    .patch(`${API_ROOT_ENDPOINT}/users/resetPassword/testToken`)
    .send({ password: 'new_password', password_confirm: 'new_password' })
    .expect(404);
});

it('should return 404 when the token expired (10 mins)', async () => {
  // Create a user
  await User.build(USER_CREATE_VALID_PAYLOAD).save();

  // Send a Reset Password Request
  const resetPwdRes = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/forgotPassword`)
    .send({ email: USER_CREATE_VALID_PAYLOAD.email })
    .expect(200);

  const token = resetPwdRes.body.resetToken;

  // Update user password_reset_expires to be 11 mins ago
  const user = await User.findOne({ email: USER_CREATE_VALID_PAYLOAD.email });
  user!.password_reset_expires = Date.now() - 11 * 60 * 1000;
  await user!.save();

  await request(app)
    .patch(`${API_ROOT_ENDPOINT}/users/resetPassword/${token}`)
    .send({ password: 'new_password', password_confirm: 'new_password' })
    .expect(404);
});

it('should return 200 and a cookie when token is valid', async () => {
  // Create a user
  await User.build(USER_CREATE_VALID_PAYLOAD).save();

  // Send a Reset Password Request
  const resetPwdRes = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/forgotPassword`)
    .send({ email: USER_CREATE_VALID_PAYLOAD.email })
    .expect(200);

  const token = resetPwdRes.body.data.resetToken;

  // It should return a cookie
  const response = await request(app)
    .patch(`${API_ROOT_ENDPOINT}/users/resetPassword/${token}`)
    .send({ password: 'new_password', password_confirm: 'new_password' })
    .expect(200);
  expect(response.get('Set-Cookie')).toBeDefined();
});
