import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
