import {
  OrderCompletedEvent,
  Publisher,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class OrderCompletedPublisher extends Publisher<OrderCompletedEvent> {
  readonly subject = Subjects.OrderCompleted;
}
