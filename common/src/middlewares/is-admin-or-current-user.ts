import { Request, Response, NextFunction } from "express";
import { UserRole } from "..";

// For routes that require userId param instead of checking if currentUser Id equal userId Param
// Add this middleware so admin can edit anything but simple user only his collection
export const isAdminOrCurrentUser = (param: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.currentUser!.role !== UserRole.Admin) {
      req.params[param] = req.currentUser!.id;
    }
    next();
  };
};
