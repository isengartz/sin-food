import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

// Middleware to restrict access only to given roles
export const restrictTo = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
      throw new NotAuthorizedError('You dont have access here');
    }
    if (!roles.includes(req.currentUser!.role)) {
      throw new NotAuthorizedError('You dont have access here');
    }
    next();
  };
};
