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
);

/**
 * Returns a MenuItem
 */
export const findOneMenuItem = findOne<MenuItemDoc, MenuItemModel>(
  MenuItem,
  {},
);

/**
 * Creates a MenuItem
 */

export const createOneMenuItem = createOne<MenuItemDoc, MenuItemModel>(
  MenuItem,
  'userId',
);

/**
 * Updates a MenuItem
 */
export const updateOneMenuItem = updateOne<MenuItemDoc, MenuItemModel>(
  MenuItem,
  'userId',
);

/**
 * Deletes a MenuItem
 */
export const deleteOneMenuItem = deleteOne<MenuItemDoc, MenuItemModel>(
  MenuItem,
  'userId',
);
