import {
  Publisher,
  RestaurantCategoryDeletedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class RestaurantCategoryDeletedPublisher extends Publisher<
  RestaurantCategoryDeletedEvent
> {
  readonly subject = Subjects.RestaurantCategoryDeleted;
}
