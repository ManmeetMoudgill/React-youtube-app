import { NextFunction, Request, Response } from "express";
import User, { UserModelType } from "../models/User";
import bcrypt from "bcryptjs";
import { saveToCookiesAndSendResponse } from "../utils/generate-token";
import {
  ErrorUserResponse,
  SignInType,
  SuccessUserResponse,
} from "../types/auth";
import { transformedUser } from "../utils/return-user";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //hasing the password
    var salt: string = bcrypt.genSaltSync(10);
    var hash: string = bcrypt.hashSync(`${req.body.password}`, salt);
    const user = new User<UserModelType>({ ...req.body, password: hash });

    const successResponse: SuccessUserResponse = {
      success: true,
      message: "User has been created",
      status: 200,
      user: transformedUser(user),
    };
    await user.save();
    //generating token
    const token: string = user?.generateAuthToken();
    saveToCookiesAndSendResponse(res, token, successResponse, 200);
  } catch (err) {
    next(err);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as SignInType;

  try {
    const invalidCredentials: ErrorUserResponse = {
      success: false,
      message: "Invaid Credentials",
      status: 400,
    };

    //check if email and password are provided
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
        status: 400,
      });

    //find the user by email
    const user = await User.findOne({
      email,
    }).select("+password");

    //check if user exists
    if (!user) return res.status(400).json(invalidCredentials);

    //compare the password
    const isPasswordValid: boolean = bcrypt.compareSync(
      password,
      user?.password
    );

    if (!isPasswordValid) return res.status(400).json(invalidCredentials);

    const successResponse: SuccessUserResponse = {
      success: true,
      message: "User has logged in successfully",
      status: 200,
      user: transformedUser(user),
    };

    //generating token
    const token: string = user?.generateAuthToken();
    saveToCookiesAndSendResponse(res, token, successResponse, 200);
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (
  req: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    //check if the user is already in the database
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      //generate token
      const token: string = user?.generateAuthToken();
      const successResponse: SuccessUserResponse = {
        success: true,
        message: "User has logged in successfully",
        status: 200,
        user: transformedUser(user),
      };
      saveToCookiesAndSendResponse(response, token, successResponse, 200);
    } else {
      //create a new user
      const user = new User<UserModelType>({ ...req.body, isGoogleAuth: true });
      const successResponse: SuccessUserResponse = {
        success: true,
        message: "User has been created",
        status: 200,
        user: transformedUser(user),
      };
      //generate token
      await user.save();
      const token: string = user?.generateAuthToken();
      saveToCookiesAndSendResponse(response, token, successResponse, 200);
    }
  } catch (err) {
    next(err);
  }
};
