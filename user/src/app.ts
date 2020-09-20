import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@sin-nombre/sinfood-common";
import { allUserRouter } from "./routes/all";
import { createUserRouter } from "./routes/create";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";

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
app.use("/api/users", allUserRouter);
app.use("/api/users", createUserRouter);
app.use("/api/users", signinRouter);
app.use("/api/users", signoutRouter);
app.use("/api/users", currentUserRouter);

// Not Found Route
app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);
export { app };
