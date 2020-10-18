import { Request, Response, NextFunction } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  UserRole,
} from "@sin-nombre/sinfood-common";
import { UserAddress } from "../models/user_address";

export const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.currentUser!.id;
  const { description, floor, full_address, location } = req.body;

  // Save Address
  const addressDoc = await UserAddress.build({
    description,
    floor,
    full_address,
    location,
    user_id,
  }).save();

  res.status(201).send({
    status: "success",
    data: {
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
  const { description, floor, full_address, location } = req.body;

  const address = await UserAddress.findOne({
    _id: addressId,
    user_id: req.currentUser!.id,
  });

  if (!address) {
    throw new NotFoundError(`User Address with id ${addressId} not found`);
  }

  // Update Address
  address.description = description;
  address.floor = floor;
  address.full_address = full_address;
  address.location = location;
  await address.save();

  res.status(200).send({
    status: "success",
    data: {
      address,
    },
  });
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Instead of using findOneAndDelete use .delete on Document
  // So the remove middleware will fire
  const address = await UserAddress.findOne({
    _id: req.params.addressId,
    user_id: req.currentUser!.id,
  });
  if (!address) {
    throw new NotFoundError(
      `Address with id ${req.params.addressId} not found`
    );
  }
  address.remove();

  res.status(204).json({
    status: "success",
    data: null,
  });
};
