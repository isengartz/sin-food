import request from 'supertest';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';

it('should return 401 if user is not logged in', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/`)
    .send({ name: 'bacon' })
    .expect(401);
});

it('should return 201 and change userId to currentUserId', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/`)
    .set('Cookie', cookie)
    .send({ name: 'bacon', userId: 'randomUserId' })
    .expect(201);

  expect(response.body.data.ingredients.userId).not.toEqual('randomUserId');
});

it('should return 201 and userId to be equal to given one when user is admin', async () => {
  const cookie = global.signinAdmin();

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/`)
    .set('Cookie', cookie)
    .send({ name: 'bacon', userId: 'randomUserId' })
    .expect(201);

  expect(response.body.data.ingredients.userId).toEqual('randomUserId');
});

it('should return 400 when name is not defined', async () => {
  const cookie = global.signin();

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/`)
    .set('Cookie', cookie)
    .send({ userId: 'randomUserId' })
    .expect(400);
});

it('should return 400 when name already exist', async () => {
  const cookie = global.signin();

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients`)
    .set('Cookie', cookie)
    .send({ name: 'bacon', userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients`)
    .set('Cookie', cookie)
    .send({ name: 'bacon', userId: 'randomUserId' })
    .expect(400);
});

it('should return 201 and category defined', async () => {
  const cookie = global.signin();

  const categoryResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/categories/`)
    .set('Cookie', cookie)
    .send({ name: 'meat', userId: 'randomUserId' })
    .expect(201);

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/`)
    .set('Cookie', cookie)
    .send({
      name: 'bacon',
      userId: 'randomUserId',
      category: categoryResponse.body.data.ingredient_categories.id,
    })
    .expect(201);

  expect(response.body.data.ingredients.userId).not.toEqual('randomUserId');
  expect(response.body.data.ingredients.category).toBeDefined();
});

it('should return price as 0.0 when price is not defined', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients`)
    .set('Cookie', cookie)
    .send({ name: 'bacon', userId: 'randomUserId' })
    .expect(201);
  expect(response.body.data.ingredients.defaultPrice).toEqual(0.0);
});
it('should return price as 0.50 when price is defined', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients`)
    .set('Cookie', cookie)
    .send({ name: 'bacon', userId: 'randomUserId', defaultPrice: 0.5 })
    .expect(201);
  expect(response.body.data.ingredients.defaultPrice).toEqual(0.5);
});
