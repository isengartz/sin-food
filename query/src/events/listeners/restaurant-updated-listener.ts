import {
  handleListenerError,
  Listener,
  RestaurantUpdatedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Restaurant } from '../../models/restaurant';

export class RestaurantUpdatedListener extends Listener<RestaurantUpdatedEvent> {
  subject: Subjects.RestaurantUpdated = Subjects.RestaurantUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: RestaurantUpdatedEvent['data'], msg: Message) {
    try {
      const {
        id,
        working_hours,
        categories,
        holidays,
        delivers_to,
        version,
        enabled,
        minimum_order,
        logo,
        name,
      } = data;

      const restaurant = await Restaurant.findByEvent({
        id,
        version,
      });

      if (!restaurant) {
        throw new Error('Restaurant Not found');
      }
      restaurant.set({
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
