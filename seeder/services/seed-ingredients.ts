import { AxiosInstance } from 'axios';
import faker from 'faker';
import { BASE_API_URL } from '../utils/const';

export const seedIngredients = async (
  instance: AxiosInstance,
  categories: { id: string; userId: string }[],
) => {
  const result = [];
  const INGREDIENT_PER_CATEGORY = 10;
  // eslint-disable-next-line no-restricted-syntax
  for (const category of categories) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < INGREDIENT_PER_CATEGORY; i++) {
      const {
        data: {
          data: { ingredients },
        },
        // eslint-disable-next-line no-await-in-loop
      } = await instance.post(`${BASE_API_URL}/ingredients/`, {
        userId: category.userId,
        name: `${faker.commerce.color()} ${faker.commerce.productName()}`,
        defaultPrice: faker.commerce.price(1, 2, 2),
        category: category.id,
      });
      result.push(ingredients);
    }
  }
  return result;
};
