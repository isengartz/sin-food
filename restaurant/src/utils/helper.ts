import { Response } from "express";
import jwt from "jsonwebtoken";
import { RestaurantDoc } from "../models/restaurant";

class Helper {
  // Sign the User Token
  static signToken(payload: { id: string; name: string }) {
    return jwt.sign(payload, process.env.JWT_RESTAURANT_SECRET!); // add the ! to remove TS error
  }

  // Creates a JWT object with the token
  static serializeToken(token: string) {
    return { jwt: token };
  }

  // Sign Serialize create cookie and send the request
  static createSendToken = (
    restaurant: RestaurantDoc,
    statusCode: number,
    res: Response
  ) => {
    // Create Token
    const token = Helper.signToken({
      id: restaurant.id,
      name: restaurant.name,
    });

    res.status(statusCode).json({
      status: "success",
      token,
      data: {
        restaurant,
      },
    });
  };
}
export { Helper };
