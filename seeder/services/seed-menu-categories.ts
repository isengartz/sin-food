import { AxiosInstance } from 'axios';
import { BASE_API_URL } from '../utils/const';

export const seedMenuItemCategories = async (
  instance: AxiosInstance,
  restaurants: { id: string }[],
) => {
  const categories = ['Pizza', 'Pasta', 'Sweets'];

  const result = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const category of categories) {
    // eslint-disable-next-line no-restricted-syntax
    for (const restaurant of restaurants) {
      const {
        data: {
          data: { menu_item_categories },
        },
        // eslint-disable-next-line no-await-in-loop
      } = await instance.post(`${BASE_API_URL}/menu/categories/`, {
        name: category,
        userId: restaurant.id,
      });

      result.push(menu_item_categories);
    }
  }
  return result;
};
