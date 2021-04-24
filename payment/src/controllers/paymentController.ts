import { NextFunction, Request, Response } from 'express';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from '@sin-nombre/sinfood-common';
import { Order } from '../models/order';
import { handlePaymentMethod } from '../utils/handle-payment-method';
import { Payment } from '../models/payment';

/**
 *
 * @param req
 * @param res
 * @param next
 */
export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { payment_method, token, orderId } = req.body;

  if (!orderId) {
    throw new BadRequestError('You have to provide an orderId');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError('Order not found');
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  if (order.status === OrderStatus.Canceled) {
    throw new BadRequestError('Order is cancelled');
  }

  const charge = await handlePaymentMethod(payment_method, order.price, token);

  const payment = Payment.build({
    orderId,
    payment_method,
    paymentId: charge?.id || '',
  });

  await payment.save();
  res.status(201).send({
    status: 'success',
    data: { payment },
  });
};
