import request from 'supertest';
import { app } from '../../app';
import { API_ROOT_ENDPOINT } from '../../utils/constants';

it('should return 401 when user is not signed in', async () => {
  const { user } = await global.signin();
  await request(app)
    .get(`${API_ROOT_ENDPOINT}/users/${user.id}`)
    .send()
    .expect(401);
});
it('should return user2 payload when user is not an admin', async () => {
  const { user } = await global.signin();
  const user2 = await global.signin();

  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users/${user.id}`)
    .set('Cookie', user2.cookie)
    .send()
    .expect(200);

  expect(response.body.data.user.id).toEqual(user2.user.id);
});

it('should return user1 payload when user is an admin', async () => {
  const { user } = await global.signin();
  const user2 = await global.signinAdmin();

  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users/${user.id}`)
    .set('Cookie', user2.cookie)
    .send()
    .expect(200);

  expect(response.body.data.user.id).toEqual(user.id);
});
