import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './events/nats-wrapper';

const start = async () => {
  // Check for ENV Vars so TS stfu and also throw an error if we forgot to define them in Kubernetes

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.ADMIN_ALLOW_PASSWORD) {
    throw new Error('ADMIN_ALLOW_PASSWORD must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.JWT_COOKIE_EXPIRES_IN) {
    throw new Error('JWT_COOKIE_EXPIRES_IN must be defined');
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
    // Init mongoose instance
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

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
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    console.log('WTF??');
  }
  app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log('Listening on port 3000!');
  });
};
start();
