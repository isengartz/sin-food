import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = 'error';

  // Any instance of our Customer Errors
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .send({ status, errors: err.serializeErrors() });
  }

  // Mongoose Validation Errors
  if (err instanceof MongooseError.ValidationError) {
    const mongooseErrors = Object.values(err.errors).map((el) => {
      return { message: el.message };
    });
    return res.status(400).send({ status, errors: mongooseErrors });
  }

  // Mongoose Cast Error
  if (err instanceof MongooseError.CastError) {
    return res.status(400).send({
      status,
      errors: [{ message: `Invalid ${err.path} : ${err.value}` }],
    });
  }

  // @ts-ignore
  if (err.code && err.code === 11000) {
    // @ts-ignore
    const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0] || null;
    const message = `Duplicate field value: ${value} Please use another value!`;
    return res.status(400).send({
      status,
      errors: [{ message }],
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).send({
    status,
    errors: [
      {
        message: 'Something Went Wrong !',
      },
    ],
  });
};
