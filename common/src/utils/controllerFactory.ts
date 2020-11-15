import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import mongoose from 'mongoose';
import { NotFoundError } from '../errors/not-found-error';
import { QueryModelHelper } from './QueryModelHelper';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { UserRole } from '../enums/user-roles';

// Create a new document of given Model
export const createOne = <
  U extends mongoose.Document,
  T extends mongoose.Model<U>
>(
  Model: T,
  authField?: string,
) => async (req: Request, res: Response, next: NextFunction) => {
  const documentName = Model.collection.collectionName;
  // Change the auth field to current user if he isn't admin and its different than his id
  if (authField) {
    if (
      // @ts-ignore
      req.body[authField] !== req.currentUser!.id &&
      req.currentUser!.role !== UserRole.Admin
    ) {
      req.body[authField] = req.currentUser!.id;
    }
  }
  // @ts-ignore
  const document: U = await Model.build(req.body).save();
  res.status(201).json({
    status: 'success',
    data: {
      [documentName]: document,
    },
  });
};

// Find one document of given Model
export const findOne = <
  U extends mongoose.Document,
  T extends mongoose.Model<U>
>(
  Model: T,
  populateOptions: {},
  authField?: string,
) => async (req: Request, res: Response, next: NextFunction) => {
  const documentName = Model.collection.collectionName;
  // Populate extra data if needed
  let query = Model.findById(req.params.id);
  if (!_.isEmpty(populateOptions)) {
    query = query.populate(populateOptions);
  }
  const document = await query;
  if (authField && document) {
    if (
      // @ts-ignore
      document[authField] !== req.currentUser!.id &&
      req.currentUser!.role !== UserRole.Admin
    ) {
      throw new NotAuthorizedError('You dont have access to this Document');
    }
  }
  res.status(200).json({
    status: 'success',
    data: {
      [documentName]: document,
    },
  });
};

// Find all documents of given Model
export const findAll = <
  U extends mongoose.Document,
  T extends mongoose.Model<U>
>(
  Model: T,
  populateOptions: {},
  authField?: string,
) => async (req: Request, res: Response, next: NextFunction) => {
  const documentName = Model.collection.collectionName;

  // Attach filter to only select documents owned by current user
  if (authField) {
    if (req.currentUser!.role !== UserRole.Admin) {
      req.query[authField] = req.currentUser!.id;
    }
  }
  const queryHelper = new QueryModelHelper(Model.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  //@ts-ignore
  const totalCount = await Model.countDocuments(queryHelper.getTotalCount());

  let query = queryHelper.getQuery();
  if (!_.isEmpty(populateOptions)) {
    query = query.populate(populateOptions);
  }
  const documents = await query;
  res.status(200).json({
    status: 'success',
    results: documents.length,
    totalCount,
    data: {
      [documentName]: documents,
    },
  });
};

// Delete a document of given Model
export const deleteOne = <
  U extends mongoose.Document,
  T extends mongoose.Model<U>
>(
  Model: T,
  authField?: string,
) => async (req: Request, res: Response, next: NextFunction) => {
  const documentName = Model.collection.collectionName;
  const document = await Model.findById(req.params.id);
  if (!document) {
    throw new NotFoundError(`No ${documentName} found with that ID`);
  }
  // if we define an authField check if current user own the Document
  if (authField) {
    if (
      // @ts-ignore
      document[authField] !== req.currentUser!.id &&
      req.currentUser!.role !== UserRole.Admin
    ) {
      throw new NotAuthorizedError('You dont have access to this Document');
    }
  }

  await document.remove();

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// Updates a document of given Model
export const updateOne = <
  U extends mongoose.Document,
  T extends mongoose.Model<U>
>(
  Model: T,
  authField?: string,
) => async (req: Request, res: Response, next: NextFunction) => {
  const documentName = Model.collection.collectionName;
  const document = await Model.findById(req.params.id);

  if (!document) {
    throw new NotFoundError(`No ${documentName} found with that ID`);
  }
  // if we define an authField check if current user own the Document
  if (authField) {
    if (
      // @ts-ignore
      document[authField] !== req.currentUser!.id &&
      req.currentUser!.role !== UserRole.Admin
    ) {
      throw new NotAuthorizedError('You dont have access to this Document');
    }
  }
  const updatedDocument = await document.updateOne(req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      [documentName]: updatedDocument,
    },
  });
};
