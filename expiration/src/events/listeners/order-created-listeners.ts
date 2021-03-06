import {
  handleListenerError,
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';

import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    try {
      // 1 hour delay
      // const delay = 3600000;
      // 1 minute delay
      const delay = 600000;

      await expirationQueue.add(
        {
          orderId: data.id,
        },
        {
          delay,
        },
      );

      msg.ack();
    } catch (e) {
      handleListenerError(e, msg);
    }
  }
}
