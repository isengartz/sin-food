import express from 'express';
import {
  currentUser,
  restrictTo,
  UserRole,
  filterByReqParam,
} from '@sin-nombre/sinfood-common';
import {
  createOneCategory,
  deleteOneCategory,
  findAllCategories,
  findAllCategoriesFromUser,
  findOneCategory,
  updateOneCategory,
} from '../controllers/menuItemCategoryController';

const Router = express.Router();

Router.route('/:id')
  .get(
    currentUser,
    restrictTo([UserRole.Restaurant, UserRole.Admin]),
    findOneCategory,
  )
  .put(
    currentUser,
    restrictTo([UserRole.Restaurant, UserRole.Admin]),
    updateOneCategory,
  )
  .delete(
    currentUser,
    restrictTo([UserRole.Restaurant, UserRole.Admin]),
    deleteOneCategory,
  );

Router.route('/')
  .post(
    currentUser,
    restrictTo([UserRole.Restaurant, UserRole.Admin]),
    createOneCategory,
  )
  .get(
    currentUser,
    restrictTo([UserRole.Restaurant, UserRole.Admin]),
    findAllCategories,
  );

Router.route('/filter/:userId').get(
  currentUser,
  restrictTo([UserRole.Admin, UserRole.User]),
  filterByReqParam('userId'),
  findAllCategoriesFromUser,
);

export { Router as menuItemCategoriesRoutes };
