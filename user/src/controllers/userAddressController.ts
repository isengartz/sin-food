import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '@sin-nombre/sinfood-common';
import { UserAddress } from '../models/user_address';
import { UserAddressCreatedPublisher } from '../events/publishers/user-address-created-publisher';
import { natsWrapper } from '../events/nats-wrapper';
import { UserAddressDeletedPublisher } from '../events/publishers/user-address-deleted-publisher';
import { UserAddressUpdatedPublisher } from '../events/publishers/user-address-updated-publisher';

export const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
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

  new UserAddressCreatedPublisher(natsWrapper.client).publish({
    id: addressDoc.id,
    version: addressDoc.version,
    location: addressDoc.location,
  });

  res.status(201).send({
    status: 'success',
    data: {
      address: addressDoc,
    },
  });
};

export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
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

  new UserAddressUpdatedPublisher(natsWrapper.client).publish({
    id: address.id,
    version: address.version,
    location: address.location,
  });

  res.status(200).send({
    status: 'success',
    data: {
      address,
    },
  });
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Instead of using findOneAndDelete use .delete on Document
  // So the remove middleware will fire
  const address = await UserAddress.findOne({
    _id: req.params.addressId,
    user_id: req.currentUser!.id,
  });
  if (!address) {
    throw new NotFoundError(
      `Address with id ${req.params.addressId} not found`,
    );
  }
  new UserAddressDeletedPublisher(natsWrapper.client).publish({
    id: address.id,
    version: address.version,
  });

  await address.remove();

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

export const getUsersAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const addresses = await UserAddress.find({
    user_id: req.params.userId,
  });

  res.status(200).send({
    status: 'success',
    data: {
      addresses,
    },
  });
};
