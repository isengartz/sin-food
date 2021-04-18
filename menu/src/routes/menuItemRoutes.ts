import express from 'express';
import {
  currentUser,
  filterByReqParam,
  restrictTo,
  UserRole,
} from '@sin-nombre/sinfood-common';
import {
  createOneMenuItem,
  deleteOneMenuItem,
  findAllMenuItems,
  findOneMenuItem,
  updateOneMenuItem,
} from '../controllers/menuItemController';

const Router = express.Router();

Router.route('/:id')
  .get(findOneMenuItem)
  .put(
    currentUser,
    restrictTo([UserRole.Restaurant, UserRole.Admin]),
    updateOneMenuItem,
  )
  .delete(
    currentUser,
    restrictTo([UserRole.Restaurant, UserRole.Admin]),
    deleteOneMenuItem,
  );

Router.route('/')
  .post(
    currentUser,
    restrictTo([UserRole.Restaurant, UserRole.Admin]),
    createOneMenuItem,
  )
  .get(findAllMenuItems);

Router.route('/filter/:userId').get(
  currentUser,
  restrictTo([UserRole.Admin, UserRole.User]),
  filterByReqParam('userId'),
  findAllMenuItems,
);
export { Router as menuItemRoutes };
