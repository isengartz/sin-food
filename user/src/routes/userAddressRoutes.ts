import {
  currentUser,
  isAdminOrCurrentUser,
  requireAuth,
} from '@sin-nombre/sinfood-common';
import express from 'express';
import {
  createAddress,
  deleteAddress,
  getUsersAddresses,
  updateAddress,
} from '../controllers/userAddressController';

const router = express.Router();

router.post('/address', currentUser, requireAuth, createAddress);
router.post('/address/:addressId', currentUser, requireAuth, updateAddress);

router.delete('/address/:addressId', currentUser, requireAuth, deleteAddress);

router.get(
  '/:userId/address',
  currentUser,
  requireAuth,
  isAdminOrCurrentUser('userId'),
  getUsersAddresses,
);
export { router as userAddressRoutes };
