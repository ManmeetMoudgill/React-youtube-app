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
import asyncMiddleware from "../middlewares/catch-async-errors";

export const signUp = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

export const signIn = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as SignInType;

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
  }
);
export const googleAuth = asyncMiddleware(
  async (req: Request, response: Response, next: NextFunction) => {
    const [userByEmail, userByName] = await Promise.all([
      User.findOne({ email: req.body.email }),
      User.findOne({ name: req.body.name }),
    ]);

    let user = userByEmail || userByName;

    let transformedUserObj = null;

    if (user) {
      transformedUserObj = transformedUser(user);
    } else {
      const newUser = new User<UserModelType>({
        ...req.body,
        isGoogleAuth: true,
      });
      await newUser.save();
      user = newUser;
      transformedUserObj = transformedUser(newUser);
    }

    const token = user?.generateAuthToken();

    const successResponse: SuccessUserResponse = {
      success: true,
      message: user
        ? "User has logged in successfully"
        : "User has been created",
      status: 200,
      user: transformedUserObj,
    };

    saveToCookiesAndSendResponse(response, token, successResponse, 200);
  }
);

export const logout = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("user_token").json({
      success: true,
      message: "User has been logged out",
      status: 200,
    });
  }
);
