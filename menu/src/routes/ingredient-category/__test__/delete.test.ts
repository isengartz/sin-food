import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';
import { natsWrapper } from '../../../events/nats-wrapper';
import { Subjects } from '@sin-nombre/sinfood-common';

it('should return 401 if user is not logged in', async () => {
  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/ingredients/categories/${mongoose.Types.ObjectId()}`,
    )
    .send({})
    .expect(401);
});

it('should return 404 when Document does not exist', async () => {
  const cookie = global.signin();
  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/ingredients/categories/${mongoose.Types.ObjectId()}`,
    )
    .set('Cookie', cookie)
    .send({})
    .expect(404);
});

it('should return 401 when user does not own the Document ', async () => {
  const cookie = global.signin();
  const cookieTwo = global.signin();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/categories`)
    .set('Cookie', cookie)
    .send({ name: 'meat', userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/ingredients/categories/${createResponse.body.data.ingredient_categories.id}`,
    )
    .set('Cookie', cookieTwo)
    .send({})
    .expect(401);
});

it('should return 204 when user owns the Document but is Admin ', async () => {
  const cookie = global.signin();
  const cookieAdmin = global.signinAdmin();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/categories`)
    .set('Cookie', cookie)
    .send({ name: 'meat', userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/ingredients/categories/${createResponse.body.data.ingredient_categories.id}`,
    )
    .set('Cookie', cookieAdmin)
    .send({})
    .expect(204);
});

it('should return 204 when user own the Document ', async () => {
  const cookie = global.signin();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/categories`)
    .set('Cookie', cookie)
    .send({ name: 'meat', userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/ingredients/categories/${createResponse.body.data.ingredient_categories.id}`,
    )
    .set('Cookie', cookie)
    .send({})
    .expect(204);
});

it('should delete all ingredients associated with the category', async () => {
  const cookie = global.signin();

  const createCategoryResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/categories`)
    .set('Cookie', cookie)
    .send({ name: 'meat', userId: 'randomUserId' })
    .expect(201);

  const createIngredientResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients`)
    .set('Cookie', cookie)
    .send({
      name: 'bacon',
      userId: createCategoryResponse.body.data.ingredient_categories.userId,
      category: createCategoryResponse.body.data.ingredient_categories.id,
    })
    .expect(201);

  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/ingredients/categories/${createCategoryResponse.body.data.ingredient_categories.id}`,
    )
    .set('Cookie', cookie)
    .send({})
    .expect(204);

  const findIngredient = await request(app)
    .get(`${API_ROOT_ENDPOINT}/ingredients/`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);
  expect(findIngredient.body.data.ingredients.length).toEqual(0);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;

  // The 3rd before end Event should be IngredientDeleted
  expect(eventsPublished[eventsPublished.length - 3][0]).toEqual(
    Subjects.IngredientDeleted,
  );
  // The last 2 Event should be MenuItemUpdated
  expect(eventsPublished[eventsPublished.length - 1][0]).toEqual(
    Subjects.MenuItemUpdated,
  );
});
