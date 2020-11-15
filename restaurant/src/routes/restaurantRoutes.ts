import express from 'express';
import {
  currentUser,
  UserRole,
  isAdminOrCurrentUser,
  requireAuth,
  restrictTo,
} from '@sin-nombre/sinfood-common';
import {
  findAllRestaurants,
  createRestaurant,
  updateRestaurant,
  signinRestaurant,
  deleteRestaurant,
  filterRestaurants,
} from '../controllers/restaurantController';
import { seedRestaurants } from '../utils/seeder';

const router = express.Router();

router.post('/signin', signinRestaurant);
router.route('/').get(findAllRestaurants).post(createRestaurant);
router.get('/filter', filterRestaurants);
router.get('/seed', seedRestaurants);
router
  .route('/:id')
  .put(
    currentUser,
    requireAuth,
    restrictTo([UserRole.Admin, UserRole.Restaurant]),
    isAdminOrCurrentUser('id'),
    updateRestaurant,
  )
  .delete(
    currentUser,
    requireAuth,
    restrictTo([UserRole.Admin]),
    deleteRestaurant,
  );
export { router as restaurantRoutes };
