import mongoose from 'mongoose';
import {
  OrderCancelledEvent,
  OrderStatus,
  PaymentMethod,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../nats-wrapper';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: 'randomUserId',
    restaurantId: 'randomRestaurantId',
    price: 5,
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    orderId: order.id,
    version: order.version + 1,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, order, msg };
};

it('should update the order', async () => {
  const { listener, data, order, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.orderId);

  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it('should ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('should fail on wrong version', async () => {
  const { listener, data, msg } = await setup();
  data.version = 5;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    // do nothing
  }

  expect(msg.ack).not.toHaveBeenCalled();
});
