import { Request, Response, NextFunction } from 'express';
import { NotFoundError, Subjects } from '@sin-nombre/sinfood-common';
import mongoose from 'mongoose';
import { UserAddress } from '../models/user_address';
import { natsWrapper } from '../events/nats-wrapper';
import { UserAddressDeletedPublisher } from '../events/publishers/user-address-deleted-publisher';
import { UserAddressUpdatedPublisher } from '../events/publishers/user-address-updated-publisher';
import { UserEvent } from '../models/user-events';
import InternalEventEmitter from '../utils/InternalEventEmitter';

export const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user_id = req.currentUser!.id;
  const { description, floor, full_address, location } = req.body;

  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    // Save Address
    const addressDoc = await UserAddress.build({
      description,
      floor,
      full_address,
      location,
      user_id,
    }).save();

    // Save Event
    await UserEvent.build({
      name: Subjects.UserAddressCreated,
      data: {
        id: addressDoc.id,
        version: addressDoc.version,
        location: addressDoc.location,
      },
    }).save();

    res.status(201).send({
      status: 'success',
      data: {
        address: addressDoc,
      },
    });

    // Emit the events to NATS
    InternalEventEmitter.emitNatsEvent();
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    await session.endSession();
  }
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

  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    // Update Address
    address.description = description;
    address.floor = floor;
    address.full_address = full_address;
    address.location = location;
    await address.save();

    // Save Event
    await UserEvent.build({
      name: Subjects.UserAddressUpdated,
      data: {
        id: address.id,
        version: address.version,
        location: address.location,
      },
    }).save();

    res.status(200).send({
      status: 'success',
      data: {
        address,
      },
    });
    // Emit the events to NATS
    InternalEventEmitter.emitNatsEvent();
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    await session.endSession();
  }
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

  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    await address.remove();

    // Save Event
    await UserEvent.build({
      name: Subjects.UserAddressDeleted,
      data: {
        id: address.id,
        version: address.version,
      },
    }).save();
    // Emit the events to NATS
    InternalEventEmitter.emitNatsEvent();
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    await session.endSession();
  }

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
