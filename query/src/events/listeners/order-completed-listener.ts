import {
  handleListenerError,
  Listener,
  OrderCompletedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCompletedListener extends Listener<OrderCompletedEvent> {
  subject: Subjects.OrderCompleted = Subjects.OrderCompleted;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCompletedEvent['data'], msg: Message) {
    try {
      const {
        orderId,
        userId,
        restaurantId,
        price,
        menu_items,
        createdAt,
        version,
        paid_via,
      } = data;

      const order = Order.build({
        id: orderId,
        userId,
        restaurantId,
        price,
        menu_items,
        createdAt,
        version,
        paid_via,
      });

      await order.save();

      msg.ack();
    } catch (e) {
      handleListenerError(e, msg);
    }
  }
}
