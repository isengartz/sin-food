import express, { Request, Response, NextFunction } from "express";
import { BadRequestError } from "@sin-nombre/sinfood-common";
import { Restaurant } from "../../models/restaurant";
import { Helper } from "../../utils/helper";

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const {
    email,
    password,
    name,
    password_confirm,
    description,
    full_address,
    location,
    delivers_to,
  } = req.body;

  // Check for Password Confirmation
  if (!password_confirm || password_confirm !== password) {
    throw new BadRequestError(
      `Password & Password Confirmation must be identical`
    );
  }

  const restaurant = await Restaurant.build({
    email,
    name,
    password,
    description,
    full_address,
    location,
    delivers_to,
  });

  req.session = Helper.serializeToken(
    Helper.signToken({
      id: restaurant.id,
      name: restaurant.name,
    })
  );
  // Send Data + JWT Back
  Helper.createSendToken(restaurant, 201, res);
});

export { router as signupRestaurant };
