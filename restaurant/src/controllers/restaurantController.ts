import { Request, Response, NextFunction } from 'express';
import {
  BadRequestError,
  findAll,
  NotFoundError,
  Password,
  AuthHelper,
  UserRestaurantPayload,
} from '@sin-nombre/sinfood-common';
import {
  Restaurant,
  RestaurantDoc,
  RestaurantModel,
} from '../models/restaurant';

/**
 * Return all Restaurants
 */
export const findAllRestaurants = findAll<RestaurantDoc, RestaurantModel>(
  Restaurant,
  {},
);

/**
 * Signup a Restaurant
 * @param req
 * @param res
 * @param next
 */
export const createRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    email,
    name,
    phone,
    description,
    full_address,
    delivers_to,
    location,
    password,
    password_confirm,
    categories,
    role,
    working_hours,
    holidays,
    minimum_order,
  } = req.body;

  if (
    !req.body.admin_passphrase ||
    req.body.admin_passphrase !== process.env.ADMIN_ALLOW_PASSWORD
  ) {
    delete req.body.role;
  }
  // Check for Password Confirmation
  if (!password_confirm || password_confirm !== password) {
    throw new BadRequestError(
      'Password & Password Confirmation must be identical',
    );
  }

  const restaurant = Restaurant.build({
    email,
    phone,
    name,
    password,
    description,
    full_address,
    location,
    delivers_to,
    categories,
    role,
    working_hours,
    holidays,
    minimum_order,
  });

  await restaurant.save();

  req.session = AuthHelper.serializeToken(
    AuthHelper.signToken({
      id: restaurant.id,
      email: restaurant.email,
      role: restaurant.role,
      name: restaurant.name,
    } as UserRestaurantPayload),
  );
  // Send Data + JWT Back
  AuthHelper.createSendToken(restaurant as UserRestaurantPayload, 201, res);
};

/**
 * Signin A Restaurant
 * @param req
 * @param res
 * @param next
 */
export const signinRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Email and Password are required');
  }
  const restaurant = await Restaurant.findOne({ email }).select('+password');
  if (!restaurant) {
    throw new NotFoundError(`User with email ${email} not found`);
  }

  // Check if password is correct
  if (!(await Password.compare(restaurant.password!, password))) {
    throw new NotFoundError(
      'Incorrect Email / Password or email doesnt exists',
    ); // Dont expose that the user exist
  }
  req.session = AuthHelper.serializeToken(
    AuthHelper.signToken({
      id: restaurant.id,
      email: restaurant.email,
      role: restaurant.role,
      name: restaurant.name,
    } as UserRestaurantPayload),
  );
  // Send Data + JWT Back
  AuthHelper.createSendToken(restaurant as UserRestaurantPayload, 200, res);
};

/**
 * Updates a Restaurant
 * @param req
 * @param res
 * @param next
 */
export const updateRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    name,
    phone,
    description,
    full_address,
    delivers_to,
    location,
    categories,
    working_hours,
    holidays,
  } = req.body;

  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    throw new BadRequestError(`Restaurant with id: ${req.params.id} not found`);
  }

  restaurant.set({
    phone,
    name,
    description,
    full_address,
    location,
    delivers_to,
    categories,
    working_hours,
    holidays,
  });

  await restaurant.save();

  req.session = AuthHelper.serializeToken(
    AuthHelper.signToken({
      id: restaurant.id,
      email: restaurant.email,
      role: restaurant.role,
      name: restaurant.name,
    } as UserRestaurantPayload),
  );
  // Send Data + JWT Back
  AuthHelper.createSendToken(restaurant as UserRestaurantPayload, 200, res);
};

/**
 * Deletes a Restaurant
 * @param req
 * @param res
 * @param next
 */
export const deleteRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.params.id) {
    throw new BadRequestError('Id must be defined');
  }
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    throw new NotFoundError(`Restaurant with id ${req.params.id} not found`);
  }
  await restaurant.remove();
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

/**
 * Find a Restaurant
 * @param req
 * @param res
 * @param next
 */
export const getRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.params.id) {
    throw new BadRequestError('Id must be defined');
  }
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    throw new NotFoundError(`Restaurant with id ${req.params.id} not found`);
  }

  res.status(200).json({
    status: 'success',
    data: { restaurant },
  });
};
