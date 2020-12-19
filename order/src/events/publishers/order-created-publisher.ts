import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
