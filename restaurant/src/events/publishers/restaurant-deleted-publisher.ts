import {
  Publisher,
  RestaurantDeletedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class RestaurantDeletedPublisher extends Publisher<RestaurantDeletedEvent> {
  readonly subject = Subjects.RestaurantDeleted;
}
