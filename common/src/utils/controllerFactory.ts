import { Request, Response, NextFunction } from "express";
import _ from "lodash";
import { QueryModelHelper } from "./QueryModelHelper";
import { NotFoundError } from "..";

// Create a new document of given Model
export const createOne = (Model: any) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const documentName = Model.collection.collectionName;
  const document = await Model.build(req.body).save();
  res.status(201).json({
    status: "success",
    data: {
      [documentName]: document,
    },
  });
};

// Find one document of given Model
export const findOne = (Model: any, populateOptions: {}) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const documentName = Model.collection.collectionName;
  // Populate extra data if needed
  let query = Model.findById(req.params.id);
  if (!_.isEmpty(populateOptions)) {
    query = query.populate({ populateOptions });
  }
  const document = await query;
  res.status(200).json({
    status: "success",
    data: {
      [documentName]: document,
    },
  });
};

// Find all documents of given Model
export const findAll = (Model: any, populateOptions: {}) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const documentName = Model.collection.collectionName;

  const queryHelper = new QueryModelHelper(Model.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const totalCount = await Model.countDocuments(queryHelper.getTotalCount());

  let query = queryHelper.getQuery();
  if (!_.isEmpty(populateOptions)) {
    query = query.populate({ populateOptions });
  }
  const documents = await query;
  res.status(200).json({
    status: "success",
    results: documents.length,
    totalCount,
    data: {
      [documentName]: documents,
    },
  });
};

// Delete a document of given Model
export const deleteOne = (Model: any) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const documentName = Model.collection.collectionName;
  const document = await Model.findByIdAndDelete(req.params.id);
  if (!document) {
    throw new NotFoundError(`No ${documentName} found with that ID`);
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};

// Updates a document of given Model
export const updateOne = (Model: any) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const documentName = Model.collection.collectionName;
  const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!document) {
    throw new NotFoundError(`No ${documentName} found with that ID`);
  }
  res.status(200).json({
    status: "success",
    data: {
      [documentName]: document,
    },
  });
};
