import {
  createOne,
  findAll,
  findOne,
  deleteOne,
  updateOne,
} from '@sin-nombre/sinfood-common';

import {
  MenuItemCategory,
  MenuItemCategoryDoc,
  MenuItemCategoryModel,
} from '../models/menu-item-category';

/**
 * Returns all MenuItem categories
 */
export const findAllCategories = findAll<
  MenuItemCategoryDoc,
  MenuItemCategoryModel
>(MenuItemCategory, {}, 'userId');

export const findAllCategoriesFromUser = findAll<
  MenuItemCategoryDoc,
  MenuItemCategoryModel
>(MenuItemCategory, {});

/**
 * Returns an MenuItem category
 */
export const findOneCategory = findOne<
  MenuItemCategoryDoc,
  MenuItemCategoryModel
>(MenuItemCategory, {}, 'userId');

/**
 * Creates an MenuItem Category
 */

export const createOneCategory = createOne<
  MenuItemCategoryDoc,
  MenuItemCategoryModel
>(MenuItemCategory, 'userId');

/**
 * Updates an MenuItem category
 */
export const updateOneCategory = updateOne<
  MenuItemCategoryDoc,
  MenuItemCategoryModel
>(MenuItemCategory, 'userId');

/**
 * Deletes an MenuItem Category
 */
export const deleteOneCategory = deleteOne<
  MenuItemCategoryDoc,
  MenuItemCategoryModel
>(MenuItemCategory, 'userId');
