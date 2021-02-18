import { Request, Response, NextFunction } from 'express';
import {
  BadRequestError,
  findAll,
  NotFoundError,
  Password,
  AuthHelper,
  QueryModelHelper,
  DateHelper,
} from '@sin-nombre/sinfood-common';
import {
  Restaurant,
  RestaurantDoc,
  RestaurantModel,
} from '../models/restaurant';

/**
 * Returns all the restaurants that delivers to specific endpoint
 * And their working hours match the current time + 10 minutes
 * @todo: Think if its possible to do it with a middleware
 * @todo: Probably move this to Query Service when is created
 * @param req
 * @param res
 * @param next
 */
export const filterRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { longitude, latitude } = req.query;

  // Check if lat & long are defined
  if (!longitude || !latitude) {
    throw new BadRequestError('Latitude and Longitude are required');
  }
  // Remove them from query string so the rest filters will be parsed by QueryModelHelper
  delete req.query.longitude;
  delete req.query.latitude;

  // convert current time and day in minutes / int
  const now = DateHelper.DayNowToHours();
  const today = DateHelper.TodayAsInt();

  // Create the base query without resolving the Promise
  const restaurantQuery = Restaurant.find({
    working_hours: {
      $elemMatch: {
        day: today,
        open: { $lte: now },
        close: { $gte: now + 10 },
      }, // have at least 10 min span
    },
    delivers_to: {
      $geoIntersects: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      },
    },
  });

  // Filter the Query
  // @ts-ignore
  const queryHelper = new QueryModelHelper(restaurantQuery, req.query);
  queryHelper.filter();
  queryHelper.limitFields();
  // @todo: Dunno if I should add limit here. Need to figure out based on frontend design later
  const totalCount = await Restaurant.countDocuments(
    // @ts-ignore
    queryHelper.getTotalCount(),
  );
  const restaurants = await queryHelper.getQuery();

  res.status(200).json({
    status: 'success',
    results: restaurants.length,
    totalCount,
    data: {
      restaurants,
    },
  });
};

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
    }),
  );
  // Send Data + JWT Back
  AuthHelper.createSendToken(restaurant, 200, res);
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
      working_hours,
      holidays,
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
