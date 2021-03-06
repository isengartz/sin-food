import {
  EmailSendingEvent,
  handleListenerError,
  Listener,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { createTransport } from 'nodemailer';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from '../../utils/constants';

export class EmailSendingListener extends Listener<EmailSendingEvent> {
  readonly subject = Subjects.EmailSending;

  readonly queueGroupName = queueGroupName;

  async onMessage(data: EmailSendingEvent['data'], msg: Message) {
    try {
      const transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.TRANSPORTER_EMAIL_USERNAME,
          pass: process.env.TRANSPORTER_EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        to: data.receiver,
        subject: data.subject,
        html: data.emailBody,
      };
      if (process.env.NODE_ENV !== 'test') {
        // @todo: Im commenting this so I wont spam my mailbox
        // await transporter.sendMail(mailOptions);
      }

      msg.ack();
    } catch (e) {
      handleListenerError(e, msg);
    }
  }
}
