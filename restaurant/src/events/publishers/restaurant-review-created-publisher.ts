import {
  Publisher,
  RestaurantReviewCreatedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class RestaurantReviewCreatedPublisher extends Publisher<RestaurantReviewCreatedEvent> {
  readonly subject = Subjects.RestaurantReviewCreated;
}
