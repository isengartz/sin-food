import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import mongoose from 'mongoose';
import { NotFoundError } from '../errors/not-found-error';
import { QueryModelHelper } from './QueryModelHelper';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { UserRole } from '../enums/user-roles';
import { GLOBAL_EXCLUDED_UPDATE_FIELDS } from './globalConsts';

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

  // This is a hack cause Im way too deep now !
  // The right thing to do, should be, change findById method to find and pass _id as a req.query parameter
  // Then call QueryModelHelper and let it do the job
  // But I will have to refactor some of the events in various services
  // So lets implement this shit and maybe do it correctly in the future ^.^

  // The idea behind this is, that if someone pass req.query, instead of passing the filters into mongoose query
  // check if there is a document returned and also check if the filters match the document values
  // this will work only for non-array fields but I dont care as I will only use it to filter user/restaurant ids
  // if the second check fails return null instead of document
  let shouldShowDocument = true;
  if (req.query && document) {
    const filters = Object.entries(req.query);
    filters.forEach((filter) => {
      // filter[0] is filter name / filter[1] is filter value
      // @ts-ignore
      if (document[filter[0]] !== filter[1]) {
        shouldShowDocument = false;
      }
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      [documentName]: shouldShowDocument ? document : null,
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
  excludes: string[] = [],
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
  // Update the document excluding any field inside excludes array or global excludes
  Object.keys(req.body).forEach((param) => {
    if (
      !excludes.includes(param) &&
      !GLOBAL_EXCLUDED_UPDATE_FIELDS.includes(param)
    ) {
      document.set({ [param]: req.body[param] });
    }
  });

  const updatedDocument = await document.save();

  res.status(200).json({
    status: 'success',
    data: {
      [documentName]: updatedDocument,
    },
  });
};
