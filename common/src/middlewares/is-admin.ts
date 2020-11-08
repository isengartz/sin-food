import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../enums/user-roles';
import { NotAuthorizedError } from '../errors/not-authorized-error';

// For routes that require userId param instead of checking if currentUser Id equal userId Param
// Add this middleware so admin can edit anything but simple user only his collection
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser || req.currentUser!.role !== UserRole.Admin) {
    throw new NotAuthorizedError('You dont have access in this route');
  }
  next();
};
