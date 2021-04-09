import {
  Publisher,
  Subjects,
  UserAddressUpdatedEvent,
} from '@sin-nombre/sinfood-common';

export class UserAddressUpdatedPublisher extends Publisher<UserAddressUpdatedEvent> {
  readonly subject = Subjects.UserAddressUpdated;
}
