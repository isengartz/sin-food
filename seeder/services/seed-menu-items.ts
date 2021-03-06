/* eslint-disable @typescript-eslint/indent */
import { AxiosInstance } from 'axios';
import faker from 'faker';
import _ from 'lodash';
import { BASE_API_URL } from '../utils/const';

export const seedMenuItems = async (
  instance: AxiosInstance,
  ingredientsGrouped: any,
  menuItemCategories: { name: string; userId: string; id: string }[],
) => {
  const results = [];
  const MENU_ITEMS_PER_RESTAURANT = 10;

  const randomIdGenerator = (arr: any) => {
    const index = Math.ceil(Math.random() * arr.length - 1);
    return arr[index].id;
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const itemCategory of menuItemCategories) {
    const restaurantsIngredients = ingredientsGrouped[itemCategory.userId];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < MENU_ITEMS_PER_RESTAURANT; i++) {
      try {
        // eslint-disable-next-line radix
        const basePrice = parseInt(faker.commerce.price(1, 5));
        const shouldAddVariation = Math.ceil(Math.random() * 10000) % 2 === 0;
        const variations = shouldAddVariation
          ? [
              {
                name: 'Normal',
                price: basePrice,
              },
              {
                name: 'Big',
                price: basePrice + 2,
              },
            ]
          : [];

        const extra_ingredients_group_1 = _.uniq([
          randomIdGenerator(restaurantsIngredients),
          randomIdGenerator(restaurantsIngredients),
          randomIdGenerator(restaurantsIngredients),
          randomIdGenerator(restaurantsIngredients),
          randomIdGenerator(restaurantsIngredients),
        ]);

        // each group should contain unique ids
        const extra_ingredients_group_2 = _.uniq([
          randomIdGenerator(restaurantsIngredients),
          randomIdGenerator(restaurantsIngredients),
          randomIdGenerator(restaurantsIngredients),
          randomIdGenerator(restaurantsIngredients),
          randomIdGenerator(restaurantsIngredients),
        ]).filter((id) => !extra_ingredients_group_1.includes(id));

        const main_ingredients = _.uniq([
          randomIdGenerator(restaurantsIngredients),
          randomIdGenerator(restaurantsIngredients),
          randomIdGenerator(restaurantsIngredients),
          randomIdGenerator(restaurantsIngredients),
          randomIdGenerator(restaurantsIngredients),
        ]);

        const extra_ingredient_groups = [
          {
            title: faker.commerce.productMaterial(),
            ingredients: extra_ingredients_group_1,
          },
          {
            title: faker.commerce.productMaterial(),
            ingredients: extra_ingredients_group_2,
          },
        ];

        const payload = {
          name: `${faker.commerce.product()} ${faker.commerce.productName()}`,
          description: faker.commerce.productDescription(),
          menu_category: itemCategory.id,
          userId: itemCategory.userId,
          base_price: basePrice,
          variations,
          main_ingredients,
          extra_ingredient_groups,
        };

        const {
          data: {
            data: { menu_items },
          },
          // eslint-disable-next-line no-await-in-loop
        } = await instance.post(`${BASE_API_URL}/menu/`, payload);

        results.push(menu_items);
      } catch (e) {
        console.log(e.response.data || e.message);
        console.log(e.stackTrace);
      }
    }
  }
  return results;
};
