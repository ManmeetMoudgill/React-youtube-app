import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

const mongoDbErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val: any) => val.message);
    return next(createError(400, message));
  }

  if (err.name === "CastError") {
    return next(createError(400, "Resource not found"));
  }

  if (err.name === "MongoError") {
    // handle MongoDB-specific errors
    switch (err.code) {
      case 11000:
        // duplicate key error (e.g. unique index violation)
        return next(createError(400, "Duplicay Key Error"));
      case 121:
        // object id error
        return next(createError(400, "Object ID error"));

      default:
        // other MongoDB errors
        return next(createError(500, "Mongodb Error"));
    }
  }

  // pass the error to the next middleware
  next(err);
};

export default mongoDbErrorHandler;
