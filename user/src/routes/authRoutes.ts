import {
  currentUser,
  requireAuth,
  restrictTo,
  restrictToOwnRecords,
  UserRole,
} from '@sin-nombre/sinfood-common';
import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  currentU,
  signout,
  allUsers,
  getUserFullInfo,
} from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/signout', signout);
router.post('/login', login);
router.get('/currentUser', currentUser, currentU);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', currentUser, requireAuth, updatePassword);
// router.get('/', currentUser, allUsers);
router.get('/', currentUser, restrictTo([UserRole.Admin]), allUsers);
router.get(
  '/:id',
  currentUser,
  requireAuth,
  restrictTo([UserRole.Admin, UserRole.User]),
  getUserFullInfo,
);

export { router as authRoutes };
