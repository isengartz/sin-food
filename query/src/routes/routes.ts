import express from 'express';
import { currentUser, requireAuth } from '@sin-nombre/sinfood-common';

import { filterRestaurants } from '../controllers/queryController';

const Router = express.Router();

Router.route('/restaurants').get(currentUser, requireAuth, filterRestaurants);

export { Router as routes };
