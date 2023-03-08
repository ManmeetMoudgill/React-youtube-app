import { Response, Request, NextFunction } from "express";

export const ErrorHandle = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  const errorResponse = {
    status,
    message,
    success: false,
  };
  return res.status(status).json(errorResponse);
};
