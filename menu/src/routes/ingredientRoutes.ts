import express from 'express';
import { currentUser, restrictTo, UserRole } from '@sin-nombre/sinfood-common';
import {
  createOneIngredient,
  deleteOneIngredient,
  findAllIngredients,
  findOneIngredient,
  updateOneIngredient,
} from '../controllers/ingredientController';

const Router = express.Router();

Router.route('/:id')
  .get(
    currentUser,
    restrictTo([UserRole.Restaurant, UserRole.Admin]),
    findOneIngredient,
  )
  .put(
    currentUser,
    restrictTo([UserRole.Restaurant, UserRole.Admin]),
    updateOneIngredient,
  )
  .delete(
    currentUser,
    restrictTo([UserRole.Restaurant, UserRole.Admin]),
    deleteOneIngredient,
  );

Router.route('/')
  .post(
    currentUser,
    restrictTo([UserRole.Restaurant, UserRole.Admin]),
    createOneIngredient,
  )
  .get(
    currentUser,
    restrictTo([UserRole.Restaurant, UserRole.Admin]),
    findAllIngredients,
  );

export { Router as ingredientRoutes };
