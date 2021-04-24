import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from '../../utils/constants';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  queueGroupName = queueGroupName;

  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, userId, restaurantId, status, price } = data;

    const order = Order.build({
      id,
      userId,
      restaurantId,
      status,
      price,
    });

    await order.save();

    msg.ack();
  }
}
