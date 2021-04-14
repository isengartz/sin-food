import request from 'supertest';
import { app } from '../../app';
import {
  API_ROOT_ENDPOINT,
  RESTAURANT_CREATE_VALID_PAYLOAD,
} from '../../utils/constants';

import { Restaurant } from '../../models/restaurant';

it('should return 1 result when the lat & long intersects with delivers_to Polygon', async () => {
  await Restaurant.build(RESTAURANT_CREATE_VALID_PAYLOAD).save();
  // I hardcoded the lat & long cause they match the Polygon of RESTAURANT_VALID_CREATE_PAYLOAD
  const response = await request(app)
    .get(
      `${API_ROOT_ENDPOINT}/query/restaurants?longitude=22.9522107&latitude=40.6095628`,
    )
    .send({})
    .expect(200);
  expect(response.body.data.restaurants.length).toEqual(1);
});
it('should filter with category too', async () => {
  await Restaurant.build(RESTAURANT_CREATE_VALID_PAYLOAD).save();

  const response = await request(app)
    .get(
      `${API_ROOT_ENDPOINT}/query/restaurants?longitude=22.9522107&latitude=40.6095628&categories[in]=category1&categories[in]=category2`,
    )
    .send({})
    .expect(200);

  expect(response.body.data.restaurants.length).toEqual(1);
});
it('should return 0 results when the category doesnt exist in document payload', async () => {
  // I hardcoded the lat & long cause they match the Polygon of RESTAURANT_VALID_CREATE_PAYLOAD
  // Dont insert the second category
  const restaurant = await Restaurant.build({
    ...RESTAURANT_CREATE_VALID_PAYLOAD,
    categories: ['category1'],
  }).save();

  const response = await request(app)
    .get(
      `${API_ROOT_ENDPOINT}/query/restaurants?longitude=22.9522107&latitude=40.6095628&categories[in]=category2`,
    )
    .send({})
    .expect(200);

  expect(response.body.data.restaurants.open.length).toEqual(0);
});
