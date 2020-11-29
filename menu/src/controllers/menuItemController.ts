import {
  createOne,
  findAll,
  findOne,
  deleteOne,
  updateOne,
} from '@sin-nombre/sinfood-common';

import { MenuItem, MenuItemDoc, MenuItemModel } from '../models/menu-item';

/**
 * Returns all MenuItems
 */
export const findAllMenuItems = findAll<MenuItemDoc, MenuItemModel>(
  MenuItem,
  {},
  'userId',
);

/**
 * Returns an MenuItem
 */
export const findOneMenuItem = findOne<MenuItemDoc, MenuItemModel>(
  MenuItem,
  {},
  'userId',
);

/**
 * Creates an MenuItem
 */

export const createOneMenuItem = createOne<MenuItemDoc, MenuItemModel>(
  MenuItem,
  'userId',
);

/**
 * Updates an MenuItem
 */
export const updateOneMenuItem = updateOne<MenuItemDoc, MenuItemModel>(
  MenuItem,
  'userId',
);

/**
 * Deletes an MenuItem
 */
export const deleteOneMenuItem = deleteOne<MenuItemDoc, MenuItemModel>(
  MenuItem,
  'userId',
);
