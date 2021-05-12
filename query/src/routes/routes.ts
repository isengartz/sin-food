import express from 'express';
import {
  currentUser,
  requireAuth,
  restrictToOwnRecords,
} from '@sin-nombre/sinfood-common';

import {
  filterRestaurants,
  getUserOrders,
} from '../controllers/queryController';

const Router = express.Router();

Router.route('/restaurants').get(filterRestaurants);

Router.route('/orders').get(
  currentUser,
  requireAuth,
  restrictToOwnRecords,
  getUserOrders,
);
export { Router as routes };
