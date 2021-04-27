import {
  handleListenerError,
  Listener,
  RestaurantCreatedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Restaurant } from '../../models/restaurant';

export class RestaurantCreatedListener extends Listener<RestaurantCreatedEvent> {
  subject: Subjects.RestaurantCreated = Subjects.RestaurantCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: RestaurantCreatedEvent['data'], msg: Message) {
    try {
      const {
        id,
        working_hours,
        categories,
        holidays,
        delivers_to,
        enabled,
        minimum_order,
        logo,
        name,
      } = data;
      const restaurant = Restaurant.build({
        id,
        working_hours,
        categories,
        holidays,
        delivers_to,
        enabled,
        minimum_order,
        logo,
        name,
      });
      await restaurant.save();

      msg.ack();
    } catch (e) {
      handleListenerError(e, msg);
    }
  }
}
