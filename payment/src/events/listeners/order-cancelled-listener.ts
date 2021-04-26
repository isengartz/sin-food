import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from '../../utils/constants';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  queueGroupName = queueGroupName;

  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { orderId, version } = data;
    console.log({ orderId, version });
    const testOrder = await Order.findById(orderId);
    console.log(testOrder);
    const order = await Order.findByEvent({ id: orderId, version });

    if (!order) {
      throw new NotFoundError('Order Not found');
    }

    order.set('status', OrderStatus.Canceled);
    await order.save();

    msg.ack();
  }
}
