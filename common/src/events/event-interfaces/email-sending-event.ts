import { Subjects } from '../subjects';

export interface EmailSendingEvent {
  subject: Subjects.EmailSending;
  data: {
    subject: string;
    receiver: string;
    emailBody: string;
  };
}
