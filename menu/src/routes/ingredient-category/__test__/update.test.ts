import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';
import { IngredientCategory } from '../../../models/ingredient-category';

it('should return 401 if user is not logged in', async () => {
  await request(app)
    .put(
      `${API_ROOT_ENDPOINT}/ingredients/categories/${mongoose.Types.ObjectId()}`,
    )
    .send({ name: 'meat' })
    .expect(401);
});

it('should return 401 when user does not own the Document', async () => {
  const cookie = global.signin();
  const cookieTwo = global.signin();

  const creteResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/categories`)
    .set('Cookie', cookie)
    .send({ name: 'meat', userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .put(
      `${API_ROOT_ENDPOINT}/ingredients/categories/${creteResponse.body.data.ingredient_categories.id}`,
    )
    .set('Cookie', cookieTwo)
    .send({ name: 'meat' })
    .expect(401);
});

it('should return 200 when user is admin', async () => {
  const cookie = global.signin();
  const cookieAdmin = global.signinAdmin();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/categories`)
    .set('Cookie', cookie)
    .send({ name: 'cheese', userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .put(
      `${API_ROOT_ENDPOINT}/ingredients/categories/${createResponse.body.data.ingredient_categories.id}`,
    )
    .set('Cookie', cookieAdmin)
    .send({
      name: 'cheese_edited',
      userId: createResponse.body.data.ingredient_categories.user_id,
    })
    .expect(200);

  const updatedCategory = await IngredientCategory.findById(
    createResponse.body.data.ingredient_categories.id,
  );
  expect(updatedCategory!.name).toEqual('cheese_edited');
});

it('should return 200 when the user owns the document', async () => {
  const cookie = global.signin();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/categories`)
    .set('Cookie', cookie)
    .send({ name: 'cheese', userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .put(
      `${API_ROOT_ENDPOINT}/ingredients/categories/${createResponse.body.data.ingredient_categories.id}`,
    )
    .set('Cookie', cookie)
    .send({
      name: 'cheese_edited',
      userId: createResponse.body.data.ingredient_categories.user_id,
    })
    .expect(200);

  const updatedCategory = await IngredientCategory.findById(
    createResponse.body.data.ingredient_categories.id,
  );
  expect(updatedCategory!.name).toEqual('cheese_edited');
});

it('should return 404 when document does not exist', async () => {
  const cookie = global.signin();

  await request(app)
    .put(
      `${API_ROOT_ENDPOINT}/ingredients/categories/${mongoose.Types.ObjectId()}`,
    )
    .set('Cookie', cookie)
    .send({
      name: 'cheese_edited',
    })
    .expect(404);

});
