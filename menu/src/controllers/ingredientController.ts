import { Request, Response, NextFunction } from 'express';
import {
  findAll,
  findOne,
  deleteOne,
  UserRole,
  NotFoundError,
  NotAuthorizedError,
} from '@sin-nombre/sinfood-common';
import {
  Ingredient,
  IngredientDoc,
  IngredientModel,
} from '../models/ingredient';
import { IngredientCreatedPublisher } from '../events/publishers/ingredient-created-publisher';
import { natsWrapper } from '../events/nats-wrapper';

import { IngredientUpdatedPublisher } from '../events/publishers/ingredient-updated-publisher';
import { IngredientDeletedPublisher } from '../events/publishers/ingredient-deleted-publisher';

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

export const createOneIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.body.userId !== req.currentUser!.id &&
    req.currentUser!.role !== UserRole.Admin
  ) {
    req.body.userId = req.currentUser!.id;
  }
  const { userId, name, defaultPrice, category } = req.body;
  const ingredient = await Ingredient.build({
    userId,
    name,
    defaultPrice,
    category,
  }).save();

  new IngredientCreatedPublisher(natsWrapper.client).publish({
    id: ingredient.id,
    price: ingredient.defaultPrice,
  });

  res.status(201).json({
    status: 'success',
    data: {
      ingredients: ingredient,
    },
  });
};

/**
 * Updates an ingredient
 */
export const updateOneIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ingredient = await Ingredient.findById(req.params.id);
  if (!ingredient) {
    throw new NotFoundError(
      `Ingredient with id ${req.params.id} doesn't exist`,
    );
  }
  // Check if admin is modifying the document or document belongs to current user
  if (
    ingredient.userId !== req.currentUser!.id &&
    req.currentUser!.role !== UserRole.Admin
  ) {
    throw new NotAuthorizedError('You dont have access to this Document');
  }

  const { name, defaultPrice, category } = req.body;
  const updatedIngredient = await ingredient.updateOne(
    { name, defaultPrice, category },
    {
      new: true,
      runValidators: true,
    },
  );

  new IngredientUpdatedPublisher(natsWrapper.client).publish({
    id: updatedIngredient.id,
    price: updatedIngredient.defaultPrice,
    version: updatedIngredient.version,
  });

  res.status(200).json({
    status: 'success',
    data: {
      ingredients: updatedIngredient,
    },
  });
};

/**
 * Deletes an Ingredient
 */
export const deleteOneIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ingredient = await Ingredient.findById(req.params.id);

  if (!ingredient) {
    throw new NotFoundError(
      `Ingredient with id ${req.params.id} doesn't exist`,
    );
  }
  if (
    ingredient.userId !== req.currentUser!.id &&
    req.currentUser!.role !== UserRole.Admin
  ) {
    throw new NotAuthorizedError('You dont have access to this Document');
  }

  await ingredient.remove();

  new IngredientDeletedPublisher(natsWrapper.client).publish({
    id: ingredient.id,
    version: ingredient.version,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
