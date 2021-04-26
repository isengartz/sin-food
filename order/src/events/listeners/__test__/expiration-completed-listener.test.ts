import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import {
  ExpirationCompletedEvent,
  OrderStatus,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { natsWrapper } from '../../nats-wrapper';
import { Order } from '../../../models/order';

import { ExpirationCompletedListener } from '../expiration-completed-listener';

const setup = async () => {
  const listener = new ExpirationCompletedListener(natsWrapper.client);

  const orderPayload = await global.createOrderPayload();
  const order = Order.build(orderPayload);
  await order.save();

  const data: ExpirationCompletedEvent['data'] = {
    orderId: order.id,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, order, msg };
};

it('should update the order status', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage with the data object and fake msg object
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.orderId);

  expect(updatedOrder).toBeDefined();
  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it('should acks the message', async () => {
  const { data, listener, msg } = await setup();

  // call onMessage with the data object and fake msg object
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('shouldnt do anything if order is completed', async () => {
  const { data, listener, msg } = await setup();

  const updatedOrder = await Order.findById(data.orderId);
  updatedOrder!.set({ status: OrderStatus.Completed });
  await updatedOrder!.save();

  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const updatedOrderAfterListener = await Order.findById(data.orderId);
  expect(updatedOrderAfterListener!.status).toEqual(OrderStatus.Completed);
});

it('shouldnt do anything if order is refunded', async () => {
  const { data, listener, msg } = await setup();

  const updatedOrder = await Order.findById(data.orderId);
  updatedOrder!.set({ status: OrderStatus.Refunded });
  await updatedOrder!.save();

  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const updatedOrderAfterListener = await Order.findById(data.orderId);
  expect(updatedOrderAfterListener!.status).toEqual(OrderStatus.Refunded);
});

it('should emit an event', async () => {
  const { data, listener, msg } = await setup();

  // call onMessage with the data object and fake msg object
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;
  // The last Event should be OrderCancelled
  expect(eventsPublished[eventsPublished.length - 1][0]).toEqual(
    Subjects.OrderCancelled,
  );
});
