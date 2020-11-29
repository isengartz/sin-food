import {
  IngredientDeletedEvent,
  Publisher,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class IngredientDeletedPublisher extends Publisher<
  IngredientDeletedEvent
> {
  readonly subject = Subjects.IngredientDeleted;
}
