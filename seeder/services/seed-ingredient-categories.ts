import { AxiosInstance } from 'axios';
import { BASE_API_URL } from '../utils/const';

export const seedIngredientCategories = async (
  instance: AxiosInstance,
  restaurants: { id: string }[],
): Promise<{ id: string; userId: string; name: string }[]> => {
  const categories = ['Meet', 'Cheese', 'Sauce'];
  const result = [];
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const restaurant of restaurants) {
      // eslint-disable-next-line no-await-in-loop,no-restricted-syntax
      for (const category of categories) {
        // eslint-disable-next-line no-await-in-loop
        const {
          data: {
            data: { ingredient_categories },
          },
          // eslint-disable-next-line no-await-in-loop
        } = await instance.post(`${BASE_API_URL}/ingredients/categories/`, {
          name: category,
          userId: restaurant.id,
        });
        result.push(ingredient_categories);
      }
    }
  } catch (e) {
    console.log(e.response.data || e.message);
  }

  return result;
};
