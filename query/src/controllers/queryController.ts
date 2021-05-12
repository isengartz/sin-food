import { Request, Response, NextFunction } from 'express';
import {
  BadRequestError,
  convertObjectKeyToArray,
  DateHelper,
  findAll,
} from '@sin-nombre/sinfood-common';
import { Restaurant } from '../models/restaurant';
import { Order, OrderDoc, OrderModel } from '../models/order';
import { generateQueryFilters } from '../utils/generate-query-filters';
import { generatePaginationAggregateQuery } from '../utils/generate-pagination-aggregate-query';

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

  const extraFilterQueries = generateQueryFilters(req);
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

/**
 * Return the orders of the user
 * @param req
 * @param res
 * @param next
 */
export const getUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { limit, page } = req.query;

  delete req.query.limit;
  delete req.query.page;

  const filter = generateQueryFilters(req);
  const paginationQuery = generatePaginationAggregateQuery(
    // @ts-ignore
    page ? (page as number) : 1,
    // @ts-ignore
    limit as number,
  );

  const last30days = new Date();
  last30days.setDate(last30days.getDate() - 30);

  const orders = await Order.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $project: {
        // convert restaurant_id to mongodb ObjectID so we can query it
        objRestaurantId: {
          $toObjectId: '$restaurantId',
        },
        orderIdToString: {
          $toString: '$_id',
        },
        paid_via: 1,
        _id: 1,
        user_id: 1,
        price: 1,
        createdAt: 1,
        menu_item: 1,
        totalCount: 1,
      },
    },
    {
      $lookup: {
        // perform a join on restaurant table
        from: 'restaurants',
        localField: 'objRestaurantId',
        foreignField: '_id',
        as: 'restaurant',
      },
    },
    {
      $lookup: {
        // perform a join on review table
        from: 'reviews',
        localField: 'orderIdToString',
        foreignField: 'orderId',
        as: 'review',
      },
    },
    {
      // add canReview field
      $addFields: {
        canReview: {
          $cond: [
            {
              $and: [
                {
                  $ifNull: ['$review._id', null], // if review_id is empty which means no active review for this order
                },
                {
                  $gte: ['$createdAt', last30days], // if the order is at less or equal 30 days old
                },
              ],
            },
            true,
            false,
          ],
        },
      },
    },
    {
      $facet: {
        // count and paginate the results
        paginatedResults: paginationQuery, // pagination
        totalCount: [
          {
            $count: 'count',
          },
        ],
      },
    },
  ]);

  console.log(orders);

  res.status(200).json({
    status: 'success',
    results:
      orders && orders.length > 0 ? orders[0].paginatedResults.length : 0,
    totalCount: orders && orders.length > 0 ? orders[0].totalCount[0].count : 0,
    data: {
      orders: orders && orders.length > 0 ? orders[0].paginatedResults : [],
    },
  });
};
