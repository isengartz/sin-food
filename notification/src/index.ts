import { app } from './app';
import { natsWrapper } from './events/nats-wrapper';
import { EmailSendingListener } from './events/listeners/email-sending-listener';

const start = async () => {
  if (!process.env.TRANSPORTER_EMAIL_USERNAME) {
    throw new Error('TRANSPORTER_EMAIL_USERNAME must be define');
  }
  if (!process.env.TRANSPORTER_EMAIL_PASSWORD) {
    throw new Error('TRANSPORTER_EMAIL_PASSWORD must be define');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    // Initialize NATS
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    // Listen for Events
    new EmailSendingListener(natsWrapper.client).listen();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log('Listening on port 3000!');
  });
};
start();
