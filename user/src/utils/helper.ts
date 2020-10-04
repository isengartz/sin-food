import { Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@sin-nombre/sinfood-common";
import { UserDoc } from "../models/user";

class Helper {
  // Sign the User Token
  static signToken(payload: { id: string; email: string; role: UserRole }) {
    return jwt.sign(payload, process.env.JWT_KEY!); // add the ! to remove TS error
  }

  // Creates a JWT object with the token
  static serializeToken(token: string) {
    return { jwt: token };
  }

  // Sign Serialize create cookie and send the request
  static createSendToken = (
    user: UserDoc,
    statusCode: number,
    res: Response
  ) => {
    // Create Token
    const token = Helper.signToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.status(statusCode).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  };
}
export { Helper };
