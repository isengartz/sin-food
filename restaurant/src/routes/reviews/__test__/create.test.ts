import request from 'supertest';
import { app } from '../../../app';
import {
  API_ROOT_ENDPOINT,
  RESTAURANT_CREATE_VALID_PAYLOAD,
  REVIEW_CREATE_VALID_PAYLOAD_WITHOUT_RESTAURANT_ID,
} from '../../../utils/constants';
import { Restaurant } from '../../../models/restaurant';
import { natsWrapper } from '../../../events/nats-wrapper';
import { Subjects } from '@sin-nombre/sinfood-common';

it('should work only for logged in users', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/reviews/`)
    .send({
      ...REVIEW_CREATE_VALID_PAYLOAD_WITHOUT_RESTAURANT_ID,
      restaurantId: 'test1234',
    })
    .expect(401);
});

it('should return 401 when user is a restaurant', async () => {
  const { cookie } = await global.signin();

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/reviews/`)
    .set('Cookie', cookie)
    .send({
      ...REVIEW_CREATE_VALID_PAYLOAD_WITHOUT_RESTAURANT_ID,
      restaurant: 'test1234',
    })
    .expect(401);
});

it('should return 400 when restaurant is not defined ', async () => {
  const cookie = global.signinUser('randomId');

  const review = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/reviews/`)
    .set('Cookie', cookie)
    .send({
      ...REVIEW_CREATE_VALID_PAYLOAD_WITHOUT_RESTAURANT_ID,
      restaurant: 'test1234',
    })
    .expect(400);
});

it('should change the userId to currentUser ', async () => {
  const cookie = global.signinUser('randomId');

  const restaurant = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(201);

  const review = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/reviews/`)
    .set('Cookie', cookie)
    .send({
      ...REVIEW_CREATE_VALID_PAYLOAD_WITHOUT_RESTAURANT_ID,
      restaurant: restaurant.body.data.user.id,
    })
    .expect(201);
  expect(review.body.data.reviews.userId).toEqual('randomId');
});

it('should update the averageRating and ratingQuantity', async () => {
  const cookie = global.signinUser('randomId');

  const restaurant = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(201);

  const review = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/reviews/`)
    .set('Cookie', cookie)
    .send({
      ...REVIEW_CREATE_VALID_PAYLOAD_WITHOUT_RESTAURANT_ID,
      restaurant: restaurant.body.data.user.id,
    })
    .expect(201);

  const updatedRestaurant = await Restaurant.findById(
    restaurant.body.data.user.id,
  );

  expect(updatedRestaurant!.ratingsAverage).toBeTruthy();
  expect(updatedRestaurant!.ratingsQuantity).toBeTruthy();
});

it('should emit a restaurant updated Event', async () => {
  const cookie = global.signinUser('randomId');

  const restaurant = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(201);

  const review = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/reviews/`)
    .set('Cookie', cookie)
    .send({
      ...REVIEW_CREATE_VALID_PAYLOAD_WITHOUT_RESTAURANT_ID,
      restaurant: restaurant.body.data.user.id,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;
  // The pro-last Event should be RestaurantUpdated
  expect(eventsPublished[eventsPublished.length - 2][0]).toEqual(
    Subjects.RestaurantUpdated,
  );
});

it('should emit a review created event', async () => {
  const cookie = global.signinUser('randomId');

  const restaurant = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(201);

  const review = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/reviews/`)
    .set('Cookie', cookie)
    .send({
      ...REVIEW_CREATE_VALID_PAYLOAD_WITHOUT_RESTAURANT_ID,
      restaurant: restaurant.body.data.user.id,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;

  // The last Event should be RestaurantUpdated
  expect(eventsPublished[eventsPublished.length - 1][0]).toEqual(
    Subjects.RestaurantReviewCreated,
  );
});
