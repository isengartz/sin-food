import {
  handleListenerError,
  Listener,
  NotFoundError,
  OrderCompletedEvent,
  OrderStatus,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from '../../utils/constants';

export class OrderCompletedListener extends Listener<OrderCompletedEvent> {
  queueGroupName = queueGroupName;

  subject: Subjects.OrderCompleted = Subjects.OrderCompleted;

  async onMessage(data: OrderCompletedEvent['data'], msg: Message) {
    try {
      const { orderId, version } = data;

      const order = await Order.findByEvent({ id: orderId, version });

      if (!order) {
        throw new NotFoundError('Order Not found');
      }

      order.set('status', OrderStatus.Completed);
      await order.save();

      msg.ack();
    } catch (e) {
      handleListenerError(e, msg);
    }
  }
}
