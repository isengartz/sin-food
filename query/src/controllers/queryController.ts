import { Request, Response, NextFunction } from 'express';
import {
  BadRequestError,
  QueryModelHelper,
  DateHelper,
} from '@sin-nombre/sinfood-common';
import { Restaurant } from '../models/restaurant';

/**
 * Returns all the restaurants that delivers to specific endpoint
 * And their working hours match the current time + 10 minutes
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
