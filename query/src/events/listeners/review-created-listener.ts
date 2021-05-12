import {
  handleListenerError,
  Listener,
  RestaurantReviewCreatedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Review } from '../../models/review';

export class ReviewCreatedListener extends Listener<RestaurantReviewCreatedEvent> {
  subject: Subjects.RestaurantReviewCreated = Subjects.RestaurantReviewCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: RestaurantReviewCreatedEvent['data'], msg: Message) {
    try {
      const {
        id,
        orderId,
        userId,
        comment,
        rating,
        restaurant,
        createdAt,
        updatedAt,
        version,
      } = data;

      const review = Review.build({
        id,
        orderId,
        userId,
        comment,
        rating,
        restaurant,
        createdAt,
        updatedAt,
        version,
      });

      await review.save();

      msg.ack();
    } catch (e) {
      handleListenerError(e, msg);
    }
  }
}
