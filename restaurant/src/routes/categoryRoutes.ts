import express from 'express';
import { currentUser, isAdmin } from '@sin-nombre/sinfood-common';
import {
  findAllCategories,
  createCategory,
  findOneCategory,
  updateOneCategory,
  deleteOneCategory,
} from '../controllers/restaurantCategoryController';

const router = express.Router();

router
  .route('/:id/')
  .get(findOneCategory)
  .put(currentUser, isAdmin, updateOneCategory) // Only admin should Update categories
  .delete(currentUser, isAdmin, deleteOneCategory); // Only admin should Delete categories
router
  .route('/')
  .get(findAllCategories)
  .post(currentUser, isAdmin, createCategory); // Only admin should create categories
// .post(createCategory); // Only admin should create categories

export { router as restaurantCategoryRouter };
