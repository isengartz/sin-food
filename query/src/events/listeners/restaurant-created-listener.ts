import {
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
    const { id, working_hours, categories, holidays, delivers_to } = data;
    const restaurant = Restaurant.build({
      id,
      working_hours,
      categories,
      holidays,
      delivers_to,
    });
    await restaurant.save();

    msg.ack();
  }
}
