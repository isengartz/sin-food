import {
  createOne,
  findAll,
  findOne,
  deleteOne,
  updateOne,
} from '@sin-nombre/sinfood-common';
import {
  Order,
  OrderDoc,
  OrderModel,
} from '../models/order';

/**
 * Returns all Orders
 */
export const findAllOrders = findAll<OrderDoc, OrderModel>(
  Order,
  {},
  'userId',
);

/**
 * Returns an Order
 */
export const findOneOrder = findOne<OrderDoc, OrderModel>(
  Order,
  {},
  'userId',
);

/**
 * Creates an Order
 */

export const createOneOrder = createOne<OrderDoc, OrderModel>(
  Order,
  'userId',
);
/**
 * Updates an Order
 */
export const updateOneOrder = updateOne<OrderDoc, OrderModel>(
  Order,
  'userId',
);

/**
 * Deletes an Order
 */
export const deleteOneOrder = deleteOne<OrderDoc, OrderModel>(
  Order,
  'userId',
);
