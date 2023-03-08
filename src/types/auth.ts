import { UserModelType } from "../models/User";
import { Request } from "express";
export interface SuccessUserResponse {
  success: true;
  message: string;
  status: number;
  user: UserAuth;
}

export interface ErrorUserResponse {
  success: false;
  message: string;
  status: number;
}

export interface SignInType {
  email: string;
  password: string;
}

export interface UserAuth {
  _id: string;
  name: string;
  email: string;
  img: string;
  subscribers: number;
  subscribedUsers: string[];
  createdAt: string;
  updatedAt: string;
}

export type AuthSignJWT = Omit<
  UserAuth,
  "img" | "subscribers" | "subscribedUser" | "createdAt" | "updatedAt"
>;

export interface CustomRequest extends Request {
  user: AuthSignJWT;
}
