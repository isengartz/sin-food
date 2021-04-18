import request from 'supertest';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';

it('should return 401 when user not logged in', async () => {
  await request(app)
    .get(`${API_ROOT_ENDPOINT}/menu/categories/filter/randomId`)
    .send({})
    .expect(401);
});

it('should return 200 when user role is user', async () => {
  const cookie = global.signinUser();
  await request(app)
    .get(`${API_ROOT_ENDPOINT}/menu/categories/filter/randomId`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);
});

it('should return 200 and restaurants categories', async () => {
  const cookie = global.signinUser();
  const restaurantCookie = global.signin();

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/categories`)
    .set('Cookie', restaurantCookie)
    .send({ name: 'Burgers', userId: 'randomUserId' })
    .expect(201);

  const { userId } = response.body.data.menu_item_categories;

  const filterResponse = await request(app)
    .get(`${API_ROOT_ENDPOINT}/menu/categories/filter/${userId}`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  expect(filterResponse.body.data.menu_item_categories.length).toEqual(1);
});

it('should return 200 and restaurants categories from only 1 restaurant', async () => {
  const cookie = global.signinUser();
  const restaurantCookie = global.signin();
  const restaurantTwoCookie = global.signin();

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/categories`)
    .set('Cookie', restaurantCookie)
    .send({ name: 'Burgers', userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu/categories`)
    .set('Cookie', restaurantTwoCookie)
    .send({ name: 'Burgers', userId: 'randomUserId' })
    .expect(201);

  const { userId } = response.body.data.menu_item_categories;

  const filterResponse = await request(app)
    .get(`${API_ROOT_ENDPOINT}/menu/categories/filter/${userId}`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  expect(filterResponse.body.data.menu_item_categories.length).toEqual(1);
});
