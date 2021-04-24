import {
  Listener,
  NotFoundError,
  OrderUpdatedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from '../../utils/constants';

export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
  queueGroupName = queueGroupName;

  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;

  async onMessage(data: OrderUpdatedEvent['data'], msg: Message) {
    const { id, userId, restaurantId, status, price, version } = data;

    const order = await Order.findByEvent({ id, version });

    if (!order) {
      throw new NotFoundError('Order Not found');
    }

    order.set({ userId, restaurantId, status, price });
    await order.save();

    msg.ack();
  }
}
