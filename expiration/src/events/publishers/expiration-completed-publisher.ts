import {
  Subjects,
  Publisher,
  ExpirationCompletedEvent,
} from '@sin-nombre/sinfood-common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}
