import express from 'express';
import {
  currentUser,
  requireAuth,
  restrictTo,
  UserRole,
} from '@sin-nombre/sinfood-common';
import { createReview } from '../controllers/restaurantReviewController';

const router = express.Router();

router
  .route('/')
  .post(
    currentUser,
    requireAuth,
    restrictTo([UserRole.Admin, UserRole.User]),
    createReview,
  );
export { router as restaurantReviewRouter };
