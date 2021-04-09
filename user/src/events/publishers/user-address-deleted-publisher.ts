import {
  Publisher,
  Subjects,
  UserAddressDeletedEvent,
} from '@sin-nombre/sinfood-common';

export class UserAddressDeletedPublisher extends Publisher<UserAddressDeletedEvent> {
  readonly subject = Subjects.UserAddressDeleted;
}
