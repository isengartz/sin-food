import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
// @ts-ignore
import xss from 'xss-clean'; // @todo: add Typescript declaration some day
import hpp from 'hpp';
import { errorHandler, RouteNotFoundError } from '@sin-nombre/sinfood-common';

const app = express();
app.set('trust proxy', true); //used for ingress-nginx

// Middleware
app.use(json());

// Security Middleware
app.use(xss());
app.use(hpp());

// Not Found Route
app.all('*', () => {
  throw new RouteNotFoundError();
});

// Attach Global Error Handler
app.use(errorHandler);

export { app };
