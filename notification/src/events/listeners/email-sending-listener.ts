import {
  EmailSendingEvent,
  Listener,
  Subjects,
} from "@sin-nombre/sinfood-common";
import { createTransport } from "nodemailer";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "../../utils/constants";

export class EmailSendingListener extends Listener<EmailSendingEvent> {
  readonly subject = Subjects.EmailSending;

  readonly queueGroupName = queueGroupName;

  async onMessage(data: EmailSendingEvent["data"], msg: Message) {
    const transporter = createTransport({
      host: "smtp.gmail.com",
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

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        throw new Error(error.message);
      }
    });
    msg.ack();
  }
}
