import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { AuthSignJWT, CustomRequest } from "../types/auth";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user_token } = req?.cookies;

  if (!user_token) {
    return next(createError(401, "Unauthorized"));
  }

  //verify the token
  const decoded = jwt.verify(user_token, process.env.JWT_SECRET_KEY as string);

  if (!decoded) {
    return next(createError(401, "Token is not valid"));
  }

  //find the user
  const user = await User.findOne({ _id: (decoded as AuthSignJWT)?._id });
  if (!user) {
    return next(createError(401, "User not found"));
  }
  (req as CustomRequest).user = user;
  next();
};
