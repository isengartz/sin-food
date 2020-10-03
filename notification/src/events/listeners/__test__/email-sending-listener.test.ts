import { EmailSendingEvent } from "@sin-nombre/sinfood-common";
import { Message } from "node-nats-streaming";
import { EmailSendingListener } from "../email-sending-listener";
import { natsWrapper } from "../../nats-wrapper";

// Setup helper
const setup = () => {
  // Create an instance of the Listener
  const listener = new EmailSendingListener(natsWrapper.client);

  const data: EmailSendingEvent["data"] = {
    subject: "test email",
    receiver: "test@test.com",
    emailBody: "Test Email",
  };

  // create a fake msg obj
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("should ack the message", async () => {
  const { data, msg, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
