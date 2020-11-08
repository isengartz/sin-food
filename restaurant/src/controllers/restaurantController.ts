import { Request, Response, NextFunction } from 'express';
import {
  BadRequestError,
  findAll,
  NotFoundError,
  Password,
  AuthHelper,
} from '@sin-nombre/sinfood-common';
import { Restaurant } from '../models/restaurant';

export const findAllRestaurants = findAll(Restaurant, {});

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
      `Password & Password Confirmation must be identical`,
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
  });

  await restaurant.save();

  req.session = AuthHelper.serializeToken(
    AuthHelper.signToken({
      id: restaurant.id,
      email: restaurant.email,
      role: restaurant.role,
    }),
  );
  // Send Data + JWT Back
  AuthHelper.createSendToken(restaurant, 201, res);
};

export const signinRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError(`Email and Password are required`);
  }
  const restaurant = await Restaurant.findOne({ email }).select('+password');
  if (!restaurant) {
    throw new NotFoundError(`User with email ${email} not found`);
  }

  // Check if password is correct
  if (!(await Password.compare(restaurant.password!, password))) {
    throw new NotFoundError(
      `Incorrect Email / Password or email doesnt exists`,
    ); // Dont expose that the user exist
  }
  req.session = AuthHelper.serializeToken(
    AuthHelper.signToken({
      id: restaurant.id,
      email: restaurant.email,
      role: restaurant.role,
    }),
  );
  // Send Data + JWT Back
  AuthHelper.createSendToken(restaurant, 200, res);
};

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
  } = req.body;

  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    {
      phone,
      name,
      description,
      full_address,
      location,
      delivers_to,
      categories,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!restaurant) {
    throw new BadRequestError(`Restaurant with id: ${req.params.id} not found`);
  }
  req.session = AuthHelper.serializeToken(
    AuthHelper.signToken({
      id: restaurant.id,
      email: restaurant.email,
      role: restaurant.role,
    }),
  );
  // Send Data + JWT Back
  AuthHelper.createSendToken(restaurant, 200, res);
};

export const deleteRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.params.id) {
    throw new BadRequestError(`Id must be defined`);
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
