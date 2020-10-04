import { Request, Response, NextFunction } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  UserRole,
} from "@sin-nombre/sinfood-common";
import { UserAddress } from "../models/user_address";
import { User } from "../models/user";

export const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.currentUser!.id;
  const { description, floor, full_address, latitude, longitude } = req.body;

  // Save Address
  const addressDoc = await UserAddress.build({
    description,
    floor,
    full_address,
    latitude,
    longitude,
    user_id,
  }).save();

  await User.findByIdAndUpdate(
    user_id,
    {
      $push: {
        addresses: addressDoc,
      },
    },
    { new: true, runValidators: true }
  );
  res.status(201).send({
    data: {
      status: "success",
      address: addressDoc,
    },
  });
};

export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { addressId } = req.params;
  const { description, floor, full_address, latitude, longitude } = req.body;

  const address = await UserAddress.findOne({
    _id: addressId,
    user_id: req.currentUser!.id,
  });

  if (!address) {
    throw new NotFoundError(`User Address with id ${addressId} not found`);
  }

  address.description = description;
  address.floor = floor;
  address.full_address = full_address;
  address.latitude = latitude;
  address.longitude = longitude;
  await address.save();
  res.status(200).send({
    data: {
      status: "success",
      address,
    },
  });
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const address = await UserAddress.findOneAndDelete({
    _id: req.params.addressId,
    user_id: req.currentUser!.id,
  });
  if (!address) {
    throw new NotFoundError(
      `Address with id ${req.params.addressId} not found`
    );
  }
  await User.findByIdAndUpdate(
    address.user_id,
    {
      $pull: {
        addresses: req.params.addressId
      },
    },
    { new: true, runValidators: true }
  );
  res.status(204).json({
    status: "success",
    data: null,
  });
};
