import express, { Request, Response, NextFunction } from "express";
import {
  currentUser,
  NotFoundError,
  requireAuth,
} from "@sin-nombre/sinfood-common";
import { UserAddress } from "../../models/user_address";
import { User } from "../../models/user";

const router = express.Router();

router.post(
  "/address/",
  currentUser,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currentUser!.id;

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError(`User ${userId} Not Found`);
    }

    const { full_address, floor, latitude, longitude, description } = req.body;

    const address = UserAddress.build({
      full_address,
      floor,
      latitude,
      longitude,
      description,
    });
    await address.save();

    user.addresses.push(address);

    user.save();

    res.status(201).send(address);
  }
);

export { router as createUserAddressRouter };
