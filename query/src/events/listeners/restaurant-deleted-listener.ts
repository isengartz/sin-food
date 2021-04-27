import {
  handleListenerError,
  Listener,
  RestaurantDeletedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Restaurant } from '../../models/restaurant';

export class RestaurantDeletedListener extends Listener<RestaurantDeletedEvent> {
  subject: Subjects.RestaurantDeleted = Subjects.RestaurantDeleted;

  queueGroupName = queueGroupName;

  async onMessage(data: RestaurantDeletedEvent['data'], msg: Message) {
    try {
      const { id, version } = data;
      const restaurant = await Restaurant.findByEvent({
        id,
        version,
      });

      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      await restaurant.remove();

      msg.ack();
    } catch (e) {
      handleListenerError(e, msg);
    }
  }
}
