import {
  handleListenerError,
  Listener,
  NotFoundError,
  RestaurantReviewUpdatedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Review } from '../../models/review';

export class ReviewUpdatedListener extends Listener<RestaurantReviewUpdatedEvent> {
  subject: Subjects.RestaurantReviewUpdated = Subjects.RestaurantReviewUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: RestaurantReviewUpdatedEvent['data'], msg: Message) {
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

      const review = await Review.findByEvent({
        id,
        version,
      });

      if (!review) {
        throw new NotFoundError('Review Not found');
      }

      review.set({
        orderId,
        userId,
        comment,
        rating,
        restaurant,
        createdAt,
        updatedAt,
      });

      await review.save();

      msg.ack();
    } catch (e) {
      handleListenerError(e, msg);
    }
  }
}
