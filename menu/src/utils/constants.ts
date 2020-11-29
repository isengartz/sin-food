import mongoose from 'mongoose';

export const API_ROOT_ENDPOINT = '/api/v1';
export const MENU_ITEM_CREATE_VALID_PAYLOAD = {
  name: 'Super Texas Burger',
  userId: mongoose.Types.ObjectId(),
  description: 'Super Burger with 100% Black Angus meat',
  base_price: 5,
  menu_category: mongoose.Types.ObjectId(),
  main_ingredients: [],
  variations: [],
  extra_ingredient_groups: [],
  image: 'null.jpg',
};
