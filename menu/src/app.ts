import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
// @ts-ignore
import xss from 'xss-clean'; // @todo: add Typescript declaration some day
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import { errorHandler, RouteNotFoundError } from '@sin-nombre/sinfood-common';
import cors from 'cors';
import { API_ROOT_ENDPOINT } from './utils/constants';
import { menuItemCategoriesRoutes } from './routes/menuItemCategoryRoutes';
import { menuItemRoutes } from './routes/menuItemRoutes';
import { ingredientCategoriesRoutes } from './routes/ingredientCategoryRoutes';
import { ingredientRoutes } from './routes/ingredientRoutes';

const app = express();
app.set('trust proxy', true); //used for ingress-nginx

// Middleware
const whitelist = ['https://restaurants.sinfood.dev'];
const corsOptions = {
  origin: function (origin: string, callback: Function) {
    if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
      callback(null, true);
    } else {
      console.log(origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
// @ts-ignore
app.use(cors(corsOptions));
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test', // dont force https when testing
    expires: new Date(
      Date.now() +
        // eslint-disable-next-line radix
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN!) * 24 * 60 * 60 * 1000,
    ),
  }),
);

// Security Middleware
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

/**
 * Routes
 */
// Menu Item Category
app.use(`${API_ROOT_ENDPOINT}/menu/categories/`, menuItemCategoriesRoutes);
// Menu Item
app.use(`${API_ROOT_ENDPOINT}/menu/`, menuItemRoutes);

// Ingredient Category
app.use(
  `${API_ROOT_ENDPOINT}/ingredients/categories/`,
  ingredientCategoriesRoutes,
);
// Ingredient
app.use(`${API_ROOT_ENDPOINT}/ingredients/`, ingredientRoutes);

// Not Found Route
app.all('*', () => {
  throw new RouteNotFoundError();
});

// Attach Global Error Handler
app.use(errorHandler);

export { app };
