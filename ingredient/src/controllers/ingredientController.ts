import {
  createOne,
  findAll,
  findOne,
  deleteOne,
  updateOne,
} from '@sin-nombre/sinfood-common';

import {
  Ingredient,
  IngredientDoc,
  IngredientModel,
} from '../models/ingredient';

/**
 * Returns all Ingredients
 */
export const findAllIngredients = findAll<IngredientDoc, IngredientModel>(
  Ingredient,
  {},
  'userId',
);

/**
 * Returns an ingredient
 */
export const findOneIngredient = findOne<IngredientDoc, IngredientModel>(
  Ingredient,
  {},
  'userId',
);

/**
 * Creates an ingredient
 */

export const createOneIngredient = createOne<IngredientDoc, IngredientModel>(
  Ingredient,
  'userId',
);

/**
 * Updates an ingredient
 */
export const updateOneIngredient = updateOne<IngredientDoc, IngredientModel>(
  Ingredient,
  'userId',
);

/**
 * Deletes an Ingredient
 */
export const deleteOneIngredient = deleteOne<IngredientDoc, IngredientModel>(
  Ingredient,
  'userId',
);
