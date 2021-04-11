import {
  createOne,
  findAll,
  findOne,
  NotFoundError,
  updateOne,
} from '@sin-nombre/sinfood-common';
import { NextFunction, Request, Response } from 'express';
import {
  RestaurantCategory,
  RestaurantCategoryDoc,
  RestaurantCategoryModel,
} from '../models/restaurant-category';

import { RestaurantCategoryDeletedPublisher } from '../events/publishers/RestaurantCategoryDeletedPublisher';
import { natsWrapper } from '../events/nats-wrapper';

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

export const deleteOneCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const category = await RestaurantCategory.findById(req.params.id);
  if (!category) {
    throw new NotFoundError('No Category found with that ID');
  }
  await new RestaurantCategoryDeletedPublisher(natsWrapper.client).publish({
    id: category.id,
    version: category.version,
  });

  await category.remove();

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
