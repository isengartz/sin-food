import { Request, Response, NextFunction } from 'express';
import {
  BadRequestError,
  convertObjectKeyToArray,
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
    throw new BadRequestError('Latitude / Longitude are required');
  }

  // Remove them from query string so the rest filters will be parsed by QueryModelHelper
  delete req.query.longitude;
  delete req.query.latitude;

  // convert current time and day in minutes / int
  const now = DateHelper.DayNowToHours();
  const today = DateHelper.TodayAsInt();

  const baseMatchingQuery = {
    delivers_to: {
      $geoIntersects: {
        $geometry: {
          type: 'Point',
          // @ts-ignore
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      },
    },
  };

  const queryObj = convertObjectKeyToArray(req.query, ['in', 'nin']);

  const queryString = JSON.stringify(queryObj).replace(
    /\b(gte|gt|lte|lt|in|nin)\b/g,
    (match) => {
      return `$${match}`;
    },
  );
  const extraFilterQueries = JSON.parse(queryString);
  console.log({ ...baseMatchingQuery, ...extraFilterQueries });

  // @todo: refactor this so it will support Timezone
  const todayAsDate = new Date(new Date().setUTCHours(0, 0, 0, 0));

  // @todo: I have to correctly calculate the Day / Time because there is an edge case
  // @todo: When someone tries to order at 23:51+ where I should check the next day

  const restaurants = await Restaurant.aggregate([
    {
      $match: {
        $and: [{ ...baseMatchingQuery, ...extraFilterQueries }],
      },
    },
    {
      $facet: {
        open: [
          {
            $match: {
              working_hours: {
                $elemMatch: {
                  day: today,
                  open: { $lte: now },
                  close: { $gte: now + 10 },
                }, // have at least 10 min span
              },
              holidays: {
                $nin: [todayAsDate],
              },
            },
          },
          {
            $project: {
              _id: 0,
              id: '$_id',
              name: 1,
              minimum_order: 1,
              logo: 1,
            },
          },
        ],
        closed: [
          {
            $match: {
              $or: [
                {
                  working_hours: {
                    $not: {
                      $elemMatch: {
                        day: today,
                        open: { $lte: now },
                        close: { $gte: now + 10 },
                      }, // have at least 10 min span
                    },
                  },
                },
                {
                  holidays: {
                    $in: [todayAsDate],
                  },
                },
              ],
            },
          },
          {
            $project: {
              _id: 0,
              id: '$_id',
              name: 1,
              minimum_order: 1,
              logo: 1,
            },
          },
        ],
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: restaurants[0].open.length,
    totalCount: restaurants[0].open.length + restaurants[0].closed.length,
    data: {
      restaurants: restaurants[0],
    },
  });
};
