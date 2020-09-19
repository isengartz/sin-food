import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { AllUserRouter } from "./routes/all";
import {CreateUserRouter} from "./routes/create";
const app = express();
app.set("trust proxy", true); //used for ingress-nginx

// Middleware
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // dont force https when testing
  })
);

// Routes
app.use("/api/users", AllUserRouter);
app.use("/api/users",CreateUserRouter);

// Not Found Route
app.all("*", () => {
  console.log(`No route found !!!`);
});

export { app };
