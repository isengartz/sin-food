import request from 'supertest';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';

it('should return 401 if user is not logged in', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/categories`)
    .send({ name: 'Burgers' })
    .expect(401);
});

it('should return 201 and change userId to currentUserId', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/categories`)
    .set('Cookie', cookie)
    .send({ name: 'Burgers', userId: 'randomUserId' })
    .expect(201);

  expect(response.body.data.menu_item_categories.userId).not.toEqual(
    'randomUserId',
  );
});

it('should return 201 and userId to be equal to given one when user is admin', async () => {
  const cookie = global.signinAdmin();

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/categories`)
    .set('Cookie', cookie)
    .send({ name: 'Burgers', userId: 'randomUserId' })
    .expect(201);

  expect(response.body.data.menu_item_categories.userId).toEqual(
    'randomUserId',
  );
});

it('should return 400 when name is not defined', async () => {
  const cookie = global.signin();

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/categories`)
    .set('Cookie', cookie)
    .send({ userId: 'randomUserId' })
    .expect(400);
});

it('should return 400 when name already exist', async () => {
  const cookie = global.signin();

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/categories`)
    .set('Cookie', cookie)
    .send({ name: 'meat', userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/categories`)
    .set('Cookie', cookie)
    .send({ name: 'meat', userId: 'randomUserId' })
    .expect(400);
});
