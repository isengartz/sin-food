import {
  IngredientCreatedEvent,
  Publisher,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class IngredientCreatedPublisher extends Publisher<
  IngredientCreatedEvent
> {
  readonly subject = Subjects.IngredientCreated;
}
