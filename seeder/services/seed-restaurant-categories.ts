import { AxiosInstance } from 'axios';
import { BASE_API_URL } from '../utils/const';

const categoryNames = [
  'Pasta',
  'Pizza',
  'Sushi',
  'Burgers',
  'Gyros',
  'Crepes',
  'Mexican',
  'Salads',
  'Sweets',
  'Grill',
];

export const seedRestaurantCategories = async (instance: AxiosInstance) => {
  const result = [];
  // eslint-disable-next-line no-plusplus,guard-for-in,no-restricted-syntax
  for (const category in categoryNames) {
    const {
      data: {
        data: { restaurant_categories },
      },
      // eslint-disable-next-line no-await-in-loop
    } = await instance.post(`${BASE_API_URL}/restaurants/categories`, {
      name: categoryNames[category],
    });
    result.push(restaurant_categories);
  }
  return result;
};
