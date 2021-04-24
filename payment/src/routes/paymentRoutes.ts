import express from 'express';
import { currentUser, requireAuth } from '@sin-nombre/sinfood-common';
import { createPayment } from '../controllers/paymentController';

const Router = express.Router();

Router.route('/').post(currentUser, requireAuth, createPayment);

export { Router as paymentRoutes };
