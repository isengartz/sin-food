import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import {
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
  PaymentMethod,
} from '@sin-nombre/sinfood-common';
import { natsWrapper } from '../../nats-wrapper';
import { Order } from '../../../models/order';
import { PaymentCreatedListener } from '../payment-created-listener';

const setup = async () => {
  const listener = new PaymentCreatedListener(natsWrapper.client);

  const orderPayload = await global.createOrderPayload();
  const order = Order.build(orderPayload);
  await order.save();

  const data: PaymentCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    orderId: order.id,
    payment_method: PaymentMethod.STRIPE,
    paymentId: 'nothing',
    version: 1,
    createdAt: new Date(),
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
  expect(updatedOrder!.status).toEqual(OrderStatus.Completed);
});

it('should acks the message', async () => {
  const { data, listener, msg } = await setup();

  // call onMessage with the data object and fake msg object
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('should emit an event', async () => {
  const { data, listener, msg } = await setup();

  // call onMessage with the data object and fake msg object
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;
  // The last Event should be OrderCompleted
  expect(eventsPublished[eventsPublished.length - 1][0]).toEqual(
    Subjects.OrderCompleted,
  );
});
