import express from 'express';
import {
  currentUser,
  requireAuth,
  restrictTo,
  restrictToOwnRecords,
  UserRole,
} from '@sin-nombre/sinfood-common';
import {
  createOneOrder,
  findAllOrders,
  findOneOrder,
  updateOneOrder,
} from '../controllers/orderController';

const Router = express.Router();

Router.route('/:id')
  .get(currentUser, requireAuth, restrictToOwnRecords, findOneOrder)
  .put(currentUser, restrictTo([UserRole.Admin]), updateOneOrder);
// .delete(currentUser, requireAuth, deleteOneOrder);

Router.route('/')
  .post(
    currentUser,
    restrictTo([UserRole.Admin, UserRole.User]),
    createOneOrder,
  )
  .get(currentUser, requireAuth, restrictToOwnRecords, findAllOrders);

// Router.post(
//   '/validateCart',
//   currentUser,
//   restrictTo([UserRole.Admin, UserRole.User]),
// );

export { Router as orderRoutes };
