import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './events/nats-wrapper';
import { MenuItemCreatedListener } from './events/listeners/menu-item-created-listener';
import { MenuItemUpdatedListener } from './events/listeners/menu-item-updated-listener';
import { IngredientCreatedListener } from './events/listeners/ingredient-created-listener';
import { IngredientUpdatedListener } from './events/listeners/ingredient-updated-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
import { ExpirationCompletedListener } from './events/listeners/expiration-completed-listener';

const start = async () => {
  // Check for ENV Vars so TS stfu and also throw an error if we forgot to define them in Kubernetes

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

    // Initialize Listeners
    new MenuItemCreatedListener(natsWrapper.client).listen();
    new MenuItemUpdatedListener(natsWrapper.client).listen();
    new IngredientCreatedListener(natsWrapper.client).listen();
    new IngredientUpdatedListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
    new ExpirationCompletedListener(natsWrapper.client).listen();
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
