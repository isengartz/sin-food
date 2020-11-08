import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';

it('should return 404 when category does not exist', async () => {
  await request(app)
    .get(
      `${API_ROOT_ENDPOINT}/restaurant/categories/${mongoose.Types.ObjectId()}`,
    )
    .send({})
    .expect(404);
});

it('should return 200 and one result', async () => {
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

  const response = await request(app)
    .get(
      `${API_ROOT_ENDPOINT}/restaurants/categories/${restaurant_categories.id}`,
    )
    .send({})
    .expect(200);

  expect(response.body.data.restaurant_categories.id).toEqual(
    restaurant_categories.id,
  );
});
