import {
  Publisher,
  Subjects,
  UserUpdatedEvent,
} from "@sin-nombre/sinfood-common";

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  subject = Subjects.UserUpdated;
}
