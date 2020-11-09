import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';

it('should return 401 when user not logged in', async () => {
  await request(app)
    .put(`${API_ROOT_ENDPOINT}/restaurants/categories/asdasd`)
    .send({ name: 'new name' })
    .expect(401);
});

it('should return 401 when user is not admin', async () => {
  const { cookie } = await global.signin();
  await request(app)
    .put(`${API_ROOT_ENDPOINT}/restaurants/categories/asdasd`)
    .set('Cookie', cookie)
    .send({ name: 'new name' })
    .expect(401);
});

it('should return 400 when bad id is provided', async () => {
  const { cookie } = await global.signinAdmin();
  await request(app)
    .put(`${API_ROOT_ENDPOINT}/restaurants/categories/asdasd`)
    .set('Cookie', cookie)
    .send({ name: 'new name' })
    .expect(400);
});

it('should return 404 category does not exist', async () => {
  const { cookie } = await global.signinAdmin();
  await request(app)
    .put(
      `${API_ROOT_ENDPOINT}/restaurants/categories/${mongoose.Types.ObjectId()}`,
    )
    .set('Cookie', cookie)
    .send({ name: 'new name' })
    .expect(404);
});

it('should return 200 on success', async () => {
  const { cookie } = await global.signinAdmin();

  const {
    body: {
      data: { restaurant_categories },
    },
  } = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories/`)
    .set('Cookie', cookie)
    .send({ name: 'Pizza' })
    .expect(201);

  await request(app)
    .put(
      `${API_ROOT_ENDPOINT}/restaurants/categories/${restaurant_categories.id}`,
    )
    .set('Cookie', cookie)
    .send({ name: 'new name' })
    .expect(200);
});
