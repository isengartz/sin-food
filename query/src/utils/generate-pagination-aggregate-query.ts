import { GLOBAL_PAGINATION_SIZE } from '@sin-nombre/sinfood-common';

export const generatePaginationAggregateQuery = (
  page: number = 1,
  limit: number = GLOBAL_PAGINATION_SIZE,
) => {
  limit *= 1;

  const skip = (page - 1) * limit;

  return [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];
};
