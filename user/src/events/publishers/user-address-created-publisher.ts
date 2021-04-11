import {
  Publisher,
  Subjects,
  UserAddressCreatedEvent,
} from '@sin-nombre/sinfood-common';

export class UserAddressCreatedPublisher extends Publisher<UserAddressCreatedEvent> {
  readonly subject = Subjects.UserAddressCreated;
}
