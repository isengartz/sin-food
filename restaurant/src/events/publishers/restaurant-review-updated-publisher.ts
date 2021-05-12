import {
  Publisher,
  RestaurantReviewUpdatedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class RestaurantReviewUpdatedPublisher extends Publisher<RestaurantReviewUpdatedEvent> {
  readonly subject = Subjects.RestaurantReviewUpdated;
}
