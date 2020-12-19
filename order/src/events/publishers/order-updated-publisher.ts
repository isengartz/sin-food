import {
  OrderUpdatedEvent,
  Publisher,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
  readonly subject = Subjects.OrderUpdated;
}
