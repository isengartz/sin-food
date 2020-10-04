import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
// @ts-ignore
import xss from "xss-clean"; // @todo: add Typescript declaration some day
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import { errorHandler, RouteNotFoundError } from "@sin-nombre/sinfood-common";
import { authRoutes } from "./routes/authRoutes";
import { API_ROOT_ENDPOINT } from "./utils/constants";
import { userAddressRoutes } from "./routes/userAddressRoutes";

const app = express();
app.set("trust proxy", true); //used for ingress-nginx

// Middleware
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // dont force https when testing
    expires: new Date(
      Date.now() +
        // eslint-disable-next-line radix
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN!) * 24 * 60 * 60 * 1000
    ),
  })
);

// Security Middleware
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

/**
 * Routes
 */

// Address
app.use(`${API_ROOT_ENDPOINT}/users`, userAddressRoutes);
// User
app.use(`${API_ROOT_ENDPOINT}/users`, authRoutes);



// Not Found Route
app.all("*", () => {
  throw new RouteNotFoundError();
});

// Attach Global Error Handler
app.use(errorHandler);

export { app };
