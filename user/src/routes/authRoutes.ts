import {
  currentUser,
  requireAuth,
  restrictTo,
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
} from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/signout', signout);
router.post('/login', login);
router.get('/currentUser', currentUser, currentU);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', currentUser, requireAuth, updatePassword);
router.get('/', currentUser, restrictTo([UserRole.Admin]), allUsers);

export { router as authRoutes };
