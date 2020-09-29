import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  // Check for ENV Vars so TS stfu and also throw an error if we forgot to define them in Kubernetes
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.JWT_COOKIE_EXPIRES_IN) {
    throw new Error("JWT_COOKIE_EXPIRES_IN must be defined");
  }
  try {
    // Init mongoose instance
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port 3000!`);
  });
};
start();
