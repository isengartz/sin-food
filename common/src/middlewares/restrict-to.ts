import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "..";

// Middleware to restrict access only to given roles
export const restrictTo = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.currentUser!.role)) {
      throw new NotAuthorizedError(`You dont have access here`);
    }
    next();
  };
};
