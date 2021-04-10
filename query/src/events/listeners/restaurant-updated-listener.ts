import {
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
    const {
      id,
      working_hours,
      categories,
      holidays,
      delivers_to,
      version,
    } = data;

    const restaurant = await Restaurant.findByEvent({
      id,
      version,
    });

    if (!restaurant) {
      throw new Error('Restaurant Not found');
    }
    restaurant.set({ working_hours, categories, holidays, delivers_to });
    await restaurant.save();

    msg.ack();
  }
}
