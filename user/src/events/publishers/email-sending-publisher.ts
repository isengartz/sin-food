import {
  Publisher,
  EmailSendingEvent,
  Subjects,
} from "@sin-nombre/sinfood-common";

export class EmailSendingPublisher extends Publisher<EmailSendingEvent> {
  readonly subject = Subjects.EmailSending;
}
