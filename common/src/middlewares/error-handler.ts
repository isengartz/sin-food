import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";
import { Error as MongooseError } from "mongoose";
import { MongoError } from "mongodb";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  if (err instanceof MongooseError.ValidationError) {
    const mongooseErrors = Object.values(err.errors).map((el) => {
      return { message: el.message };
    });
    return res.status(400).send({ errors: mongooseErrors });
  }
  if (err instanceof MongooseError.CastError) {
    return res
      .status(400)
      .send({ errors: [{ message: `Invalid ${err.path} : ${err.value}` }] });
  }
  if (err instanceof MongoError) {
    if (err.code === 11000) {
      // @ts-ignore
      const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0] || null;
      const message = `Duplicate field value: ${value} Please use another value!`;
      return res.status(400).send({
        errors: [{ message }],
      });
    }
  }
  console.error(err);
  res.status(500).send({
    errors: [
      {
        message: "Something Went Wrong !",
      },
    ],
  });
};
