import {
  createOne,
  deleteOne,
  findAll,
  findOne,
  updateOne,
} from "@sin-nombre/sinfood-common";
import RestaurantCategory from "../models/restaurant-category";


export const findAllCategories = findAll(RestaurantCategory, {});
export const findOneCategory = findOne(RestaurantCategory, {});
export const createCategory = createOne(RestaurantCategory);
export const updateOneCategory = updateOne(RestaurantCategory);
export const deleteOneCategory = deleteOne(RestaurantCategory);
