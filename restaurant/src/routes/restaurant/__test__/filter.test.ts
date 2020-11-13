import request from 'supertest';
import { app } from '../../../app';
import {
  API_ROOT_ENDPOINT,
  RESTAURANT_CREATE_VALID_PAYLOAD,
} from '../../../utils/constants';
import { RestaurantCategory } from '../../../models/restaurant-category';
import { Restaurant } from '../../../models/restaurant';

it('should return 1 result when the lat & long intersects with delivers_to Polygon', async () => {
  await global.signin();
  // I hardcoded the lat & long cause they match the Polygon of RESTAURANT_VALID_CREATE_PAYLOAD
  const response = await request(app)
    .get(
      `${API_ROOT_ENDPOINT}/restaurants/filter?longitude=22.9522107&latitude=40.6095628`,
    )
    .send({})
    .expect(200);
  expect(response.body.data.restaurants.length).toEqual(1);
});
it('should filter with category too', async () => {
  const categoryOne = await RestaurantCategory.build({ name: 'Pasta' });
  const categoryTwo = await RestaurantCategory.build({ name: 'Pizza' });
  // I hardcoded the lat & long cause they match the Polygon of RESTAURANT_VALID_CREATE_PAYLOAD

  await Restaurant.build({
    ...RESTAURANT_CREATE_VALID_PAYLOAD,
    categories: [categoryOne.id, categoryTwo.id],
  }).save();

  const response = await request(app)
    .get(
      `${API_ROOT_ENDPOINT}/restaurants/filter?longitude=22.9522107&latitude=40.6095628&categories[in]=${categoryOne.id}&categories[in]=${categoryTwo.id}`,
    )
    .send({})
    .expect(200);

  expect(response.body.data.restaurants.length).toEqual(1);
});
it('should return 0 results when the category doesnt exist in document payload', async () => {
  const categoryOne = await RestaurantCategory.build({ name: 'Pasta' });
  const categoryTwo = await RestaurantCategory.build({ name: 'Pizza' });

  // I hardcoded the lat & long cause they match the Polygon of RESTAURANT_VALID_CREATE_PAYLOAD
  // Dont insert the second category
  await Restaurant.build({
    ...RESTAURANT_CREATE_VALID_PAYLOAD,
    categories: [categoryOne.id],
  }).save();

  const response = await request(app)
    .get(
      `${API_ROOT_ENDPOINT}/restaurants/filter?longitude=22.9522107&latitude=40.6095628&categories[in]=${categoryTwo.id}`,
    )
    .send({})
    .expect(200);

  expect(response.body.data.restaurants.length).toEqual(0);
});
