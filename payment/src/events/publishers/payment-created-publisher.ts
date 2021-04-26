import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
