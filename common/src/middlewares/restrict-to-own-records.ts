import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../enums/user-roles';

/**
 * Sets a filter so users and restaurants can select only their records
 * Used for endpoints that are used from both entities
 * @param req
 * @param res
 * @param next
 */
export const restrictToOwnRecords = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.currentUser!.role === UserRole.User) {
    req.query.userId = req.currentUser!.id;
  }
  if (req.currentUser!.role === UserRole.Restaurant) {
    req.query.restaurantId = req.currentUser!.id;
  }
  next();
};
