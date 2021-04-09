import {
  Publisher,
  RestaurantUpdatedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class RestaurantUpdatedPublisher extends Publisher<RestaurantUpdatedEvent> {
  readonly subject = Subjects.RestaurantUpdated;
}
