import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../nats-wrapper';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: 'randomUserId',
    restaurantId: 'randomRestaurantId',
    price: 5,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it('should create new order', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.price);
});

it('should ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
