import {
  IngredientUpdatedEvent,
  Publisher,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class IngredientUpdatedPublisher extends Publisher<
  IngredientUpdatedEvent
> {
  readonly subject = Subjects.IngredientUpdated;
}
