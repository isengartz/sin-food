import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';

it('should return 401 when user does not own the Document', async () => {
  const cookie = global.signin();
  const cookieTwo = global.signin();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/categories`)
    .set('Cookie', cookie)
    .send({ name: 'Burgers', userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .get(
      `${API_ROOT_ENDPOINT}/menu/categories/${createResponse.body.data.menu_item_categories.id}`,
    )
    .set('Cookie', cookieTwo)
    .send({})
    .expect(401);
});

it('should return 200 when user does not own the Document but is an Admin', async () => {
  const cookie = global.signin();
  const cookieAdmin = global.signinAdmin();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/categories`)
    .set('Cookie', cookie)
    .send({ name: 'Burgers', userId: 'randomUserId' })
    .expect(201);

  const response = await request(app)
    .get(
      `${API_ROOT_ENDPOINT}/menu/categories/${createResponse.body.data.menu_item_categories.id}`,
    )
    .set('Cookie', cookieAdmin)
    .send({})
    .expect(200);

  expect(response.body.data.menu_item_categories.id).toEqual(
    createResponse.body.data.menu_item_categories.id,
  );
});

it('should return 200 when user owns the Document', async () => {
  const cookie = global.signin();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/categories`)
    .set('Cookie', cookie)
    .send({ name: 'Burgers', userId: 'randomUserId' })
    .expect(201);

  const response = await request(app)
    .get(
      `${API_ROOT_ENDPOINT}/menu/categories/${createResponse.body.data.menu_item_categories.id}`,
    )
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  expect(response.body.data.menu_item_categories.id).toEqual(
    createResponse.body.data.menu_item_categories.id,
  );
});

it('should return 200 and no Document when no Document found', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/menu/categories/${mongoose.Types.ObjectId()}`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);
  expect(response.body.data.menu_item_categories).toEqual(null);
});

it('should return 401 when user not logged in', async () => {
  await request(app)
    .get(`${API_ROOT_ENDPOINT}/menu/categories/${mongoose.Types.ObjectId()}`)
    .send({})
    .expect(401);
});
