import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  addresses: {
    description: string;
    floor: string;
    full_address: string;
    latitude: string;
    longitude: string;
  }[];
  phone: string;
  created_at: Date;
  password_changed_at: Date;
  password_reset_token: string;
  password_reset_expires: Date;
}
// Modify Express Request Type and add currentUser
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    // equiv to !req.session || !req.session.jwt
    return next();
  }
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (e) {}
  next();
};
