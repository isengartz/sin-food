import {
  createOne,
  findAll,
  findOne,
  NotFoundError,
  updateOne,
} from '@sin-nombre/sinfood-common';
import { Review, ReviewDoc, ReviewModel } from '../models/review';

export const createReview = createOne<ReviewDoc, ReviewModel>(Review, 'userId');
