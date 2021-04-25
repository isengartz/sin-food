import { OrderStatus, PaymentMethod } from '@sin-nombre/sinfood-common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../app';
import { Order } from '../../../models/order';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';
import { Payment } from '../../../models/payment';
import { stripe } from '../../../utils/stripe';

it('should return 401 when not loged in', async () => {
  await request(app).post(`${API_ROOT_ENDPOINT}/payments`).expect(401);
});

it('should return 400 when no orderId is provided', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/payments`)
    .set('Cookie', global.signin())
    .send({})
    .expect(400);
});

it('should return 404 when there is no order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userId);
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/payments`)
    .set('Cookie', cookie)
    .send({ orderId: new mongoose.Types.ObjectId().toHexString() })
    .expect(404);
});

it('should return 401 when order does not belong to user', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userId);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    restaurantId: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/payments`)
    .set('Cookie', cookie)
    .send({ orderId: order.id })
    .expect(401);
});

it('should return 400 when order is cancelled', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userId);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    restaurantId: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Canceled,
  });
  await order.save();

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/payments`)
    .set('Cookie', cookie)
    .send({ orderId: order.id })
    .expect(400);
});

it('should return 201 with valid input and Payment type as Stripe', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userId);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    restaurantId: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/payments`)
    .set('Cookie', cookie)
    .send({
      orderId: order.id,
      token: 'tok_visa',
      payment_method: PaymentMethod.STRIPE,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === order.price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('eur');

  const payment = await Payment.findOne({
    orderId: order.id,
    paymentId: stripeCharge!.id,
  });
  expect(payment).not.toBeNull();
});

it('should return 201 with valid input and Payment type as Cash', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userId);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    restaurantId: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/payments`)
    .set('Cookie', cookie)
    .send({
      orderId: order.id,
      payment_method: PaymentMethod.CASH,
    })
    .expect(201);

  const payment = await Payment.findOne({
    orderId: order.id,
  });
  expect(payment).not.toBeNull();
  expect(payment!.paymentId).toBeFalsy();
});
