import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';
import { Ingredient } from '../../../models/ingredient';
import { natsWrapper } from '../../../events/nats-wrapper';

it('should return 401 if user is not logged in', async () => {
  await request(app)
    .put(`${API_ROOT_ENDPOINT}/ingredients/${mongoose.Types.ObjectId()}`)
    .send({ name: 'meat' })
    .expect(401);
});

it('should return 401 when user does not own the Document', async () => {
  const cookie = global.signin();
  const cookieTwo = global.signin();

  const creteResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/`)
    .set('Cookie', cookie)
    .send({ name: 'meat', userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .put(
      `${API_ROOT_ENDPOINT}/ingredients/${creteResponse.body.data.ingredients.id}`,
    )
    .set('Cookie', cookieTwo)
    .send({ name: 'meat' })
    .expect(401);
});

it('should return 200 when user is admin', async () => {
  const cookie = global.signin();
  const cookieAdmin = global.signinAdmin();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/`)
    .set('Cookie', cookie)
    .send({ name: 'cheese', userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .put(
      `${API_ROOT_ENDPOINT}/ingredients/${createResponse.body.data.ingredients.id}`,
    )
    .set('Cookie', cookieAdmin)
    .send({
      name: 'cheese_edited',
      userId: createResponse.body.data.ingredients.user_id,
    })
    .expect(200);

  const updatedIngredient = await Ingredient.findById(
    createResponse.body.data.ingredients.id,
  );
  expect(updatedIngredient!.name).toEqual('cheese_edited');
});

it('should return 200 when the user owns the document', async () => {
  const cookie = global.signin();

  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/ingredients/`)
    .set('Cookie', cookie)
    .send({ name: 'cheese', userId: 'randomUserId' })
    .expect(201);

  await request(app)
    .put(
      `${API_ROOT_ENDPOINT}/ingredients/${createResponse.body.data.ingredients.id}`,
    )
    .set('Cookie', cookie)
    .send({
      name: 'cheese_edited',
      userId: createResponse.body.data.ingredients.user_id,
    })
    .expect(200);

  const updatedIngredient = await Ingredient.findById(
    createResponse.body.data.ingredients.id,
  );
  expect(updatedIngredient!.name).toEqual('cheese_edited');

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('should return 404 when document does not exist', async () => {
  const cookie = global.signin();

  await request(app)
    .put(`${API_ROOT_ENDPOINT}/ingredients/${mongoose.Types.ObjectId()}`)
    .set('Cookie', cookie)
    .send({
      name: 'cheese_edited',
    })
    .expect(404);
});
