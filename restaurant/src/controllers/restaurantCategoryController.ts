import {
  createOne,
  deleteOne,
  findAll,
  findOne,
  updateOne,
} from '@sin-nombre/sinfood-common';
import {
  RestaurantCategory,
  RestaurantCategoryDoc,
  RestaurantCategoryModel,
} from '../models/restaurant-category';

const test = RestaurantCategory;

export const findAllCategories = findAll<
  RestaurantCategoryDoc,
  RestaurantCategoryModel
>(RestaurantCategory, {});
export const findOneCategory = findOne<
  RestaurantCategoryDoc,
  RestaurantCategoryModel
>(RestaurantCategory, {});
export const createCategory = createOne<
  RestaurantCategoryDoc,
  RestaurantCategoryModel
>(RestaurantCategory);
export const updateOneCategory = updateOne<
  RestaurantCategoryDoc,
  RestaurantCategoryModel
>(RestaurantCategory);
export const deleteOneCategory = deleteOne<
  RestaurantCategoryDoc,
  RestaurantCategoryModel
>(RestaurantCategory);
