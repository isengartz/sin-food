import {
  createOne,
  findAll,
  findOne,
  deleteOne,
  updateOne,
} from '@sin-nombre/sinfood-common';
import { Order, OrderDoc, OrderModel } from '../models/order';

// @todo: The below routes should be used by both users and restaurants
// Should I create separate routes or instead of controllerFactory add custom implementation?
// Should I add a helper func that returns the authField based on JWT Role ?
// Maybe add a middleware ?
// Dont over think it now. Your brain is burned af.
// Will come back to this later

// Update 16/12 .
// I need for sure a function to return the authField based on JWT Role. But how I will pass the req body as an argument?
// Add a middleware that sets res.locals.authField plus a check inside controllerFactory
// How do I secure the update endpoint tho? Bingo! Exclude both authFields = problem solved!
// Do I need to treat create endpoint in a special way too ? No mongoose validation will handle everything here.

// Update 19/12
// Only admin should be able to update an order.....
// Im a fucking retard -.-

/**
 * Returns all Orders
 */
export const findAllOrders = findAll<OrderDoc, OrderModel>(Order, {});

/**
 * Returns an Order
 */
export const findOneOrder = findOne<OrderDoc, OrderModel>(Order, {});

/**
 * Creates an Order
 */

export const createOneOrder = createOne<OrderDoc, OrderModel>(Order, 'userId');
/**
 * Updates an Order
 */
export const updateOneOrder = updateOne<OrderDoc, OrderModel>(Order);

/**
 * Deletes an Order
 */
// I dont think that someone should be able to delete the order so comment this out
// export const deleteOneOrder = deleteOne<OrderDoc, OrderModel>(Order, 'userId');
