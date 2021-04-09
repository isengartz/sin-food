import {
  Publisher,
  RestaurantCreatedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class RestaurantCreatedPublisher extends Publisher<RestaurantCreatedEvent> {
  readonly subject = Subjects.RestaurantCreated;
}
