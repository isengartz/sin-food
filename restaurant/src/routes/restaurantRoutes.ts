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
  getRestaurant,
  getCurrentRestaurant,
  logoutRestaurant,
} from '../controllers/restaurantController';
import { seedRestaurants } from '../utils/seeder';

const router = express.Router();

router.post('/signin', signinRestaurant);
router.post('/logout', logoutRestaurant);
router.route('/').get(findAllRestaurants).post(createRestaurant);
router.get('/seed', seedRestaurants);
router.get('/currentRestaurant', currentUser, getCurrentRestaurant);
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
  )
  .get(
    currentUser,
    requireAuth,
    restrictTo([UserRole.Admin, UserRole.User]),
    getRestaurant,
  );
export { router as restaurantRoutes };
