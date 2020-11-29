import request from 'supertest';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';

it('should return 200 and no Documents when user does not own the Document', async () => {
  const cookie = global.signin();
  const cookieTwo = global.signin();

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/categories`)
    .set('Cookie', cookie)
    .send({ name: 'meat', userId: 'randomUserId' })
    .expect(201);

  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/ingredients/categories/`)
    .set('Cookie', cookieTwo)
    .send({})
    .expect(200);

  expect(response.body.data.ingredient_categories.length).toEqual(0);
});

it('should return 200 and all Documents when user is an Admin', async () => {
  const cookie = global.signin();
  const cookieAdmin = global.signinAdmin();

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/categories`)
    .set('Cookie', cookie)
    .send({ name: 'meat', userId: 'randomUserId' })
    .expect(201);

  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/ingredients/categories/`)
    .set('Cookie', cookieAdmin)
    .send({})
    .expect(200);

  expect(response.body.data.ingredient_categories.length).toEqual(1);
});

it('should return 200 and one Document when user owns the Document', async () => {
  const cookie = global.signin();

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/categories`)
    .set('Cookie', cookie)
    .send({ name: 'meat', userId: 'randomUserId' })
    .expect(201);

  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/ingredients/categories/`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  expect(response.body.data.ingredient_categories.length).toEqual(1);
});

it('should return 200 and no Document when no Document found', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/ingredients/categories/`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);
  expect(response.body.data.ingredient_categories.length).toEqual(0);
});

it('should return 401 when user not logged in', async () => {
  await request(app)
    .get(`${API_ROOT_ENDPOINT}/ingredients/categories/`)
    .send({})
    .expect(401);
});
