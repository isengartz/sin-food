import express from 'express';
import { currentUser, requireAuth } from '@sin-nombre/sinfood-common';
import {
  createOneOrder,
  deleteOneOrder,
  findAllOrders,
  findOneOrder,
  updateOneOrder,
} from '../controllers/orderController';

const Router = express.Router();

Router.route('/:id')
  .get(currentUser, requireAuth, findOneOrder)
  .put(currentUser, requireAuth, updateOneOrder)
  .delete(currentUser, requireAuth, deleteOneOrder);

Router.route('/')
  .post(currentUser, requireAuth, createOneOrder)
  .get(currentUser, requireAuth, findAllOrders);

export { Router as orderRoutes };
