import { Request, Response, NextFunction } from "express";
import { BadRequestError, findAll } from "@sin-nombre/sinfood-common";
import { Restaurant } from "../models/restaurant";
import { Helper } from "../utils/helper";

export const findAllRestaurants = findAll(Restaurant, {});

export const createRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    email,
    name,
    phone,
    description,
    full_address,
    delivers_to,
    location,
    password,
    password_confirm,
  } = req.body;

  // Check for Password Confirmation
  if (!password_confirm || password_confirm !== password) {
    throw new BadRequestError(
      `Password & Password Confirmation must be identical`
    );
  }

  const restaurant = Restaurant.build({
    email,
    phone,
    name,
    password,
    description,
    full_address,
    location,
    delivers_to,
  });

  await restaurant.save();

  req.session = Helper.serializeToken(
    Helper.signToken({
      id: restaurant.id,
      name: restaurant.name,
    })
  );
  // Send Data + JWT Back
  Helper.createSendToken(restaurant, 201, res);
};
