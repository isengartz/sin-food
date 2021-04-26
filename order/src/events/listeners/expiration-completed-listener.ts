import {
  ExpirationCompletedEvent,
  Listener,
  OrderStatus,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;

  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompletedEvent['data'], msg: Message) {
    const { orderId } = data;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Menu Item not found');
    }

    // Don do anything if Order is completed or refunded
    if (
      order.status === OrderStatus.Completed ||
      order.status === OrderStatus.Refunded
    ) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.Canceled });
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      orderId: order.id,
      version: order.version,
    });

    msg.ack();
  }
}
