import {
  Publisher,
  Subjects,
  UserCreatedEvent,
} from '@sin-nombre/sinfood-common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
}
