import {
  createOne,
  findAll,
  findOne,
  deleteOne,
  updateOne,
} from '@sin-nombre/sinfood-common';

import {
  IngredientCategory,
  IngredientCategoryDoc,
  IngredientCategoryModel,
} from '../models/ingredient-category';

/**
 * Returns all Ingredient categories
 */
export const findAllCategories = findAll<
  IngredientCategoryDoc,
  IngredientCategoryModel
>(IngredientCategory, {}, 'userId');

/**
 * Returns an ingredient category
 */
export const findOneCategory = findOne<
  IngredientCategoryDoc,
  IngredientCategoryModel
>(IngredientCategory, {}, 'userId');

/**
 * Creates an ingredient Category
 */

export const createOneCategory = createOne<
  IngredientCategoryDoc,
  IngredientCategoryModel
>(IngredientCategory, 'userId');

/**
 * Updates an ingredient category
 */
export const updateOneCategory = updateOne<
  IngredientCategoryDoc,
  IngredientCategoryModel
>(IngredientCategory, 'userId');

/**
 * Deletes an Ingredient Category
 */
export const deleteOneCategory = deleteOne<
  IngredientCategoryDoc,
  IngredientCategoryModel
>(IngredientCategory, 'userId');
