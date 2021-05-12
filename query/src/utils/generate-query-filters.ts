import { Request } from 'express';
import { convertObjectKeyToArray } from '@sin-nombre/sinfood-common';

export const generateQueryFilters = (req: Request) => {
  const queryObj = convertObjectKeyToArray(req.query, ['in', 'nin']);

  const queryString = JSON.stringify(queryObj).replace(
    /\b(gte|gt|lte|lt|in|nin)\b/g,
    (match) => {
      return `$${match}`;
    },
  );
  return JSON.parse(queryString);
};
