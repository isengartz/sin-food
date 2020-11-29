import express from 'express';
import { currentUser, restrictTo, UserRole } from '@sin-nombre/sinfood-common';
import {
  createOneMenuItem,
  deleteOneMenuItem,
  findAllMenuItems,
  findOneMenuItem,
  updateOneMenuItem,
} from '../controllers/menuItemController';

const Router = express.Router();

Router.route('/:id')
  .get(
    currentUser,
    restrictTo([UserRole.Restaurant, UserRole.Admin]),
    findOneMenuItem,
  )
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
  .get(
    currentUser,
    restrictTo([UserRole.Restaurant, UserRole.Admin]),
    findAllMenuItems,
  );

export { Router as menuItemRoutes };
