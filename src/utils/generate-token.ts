import { Response } from "express";
import { SuccessUserResponse } from "../types/auth";
export const saveToCookiesAndSendResponse = (
  res: Response,
  token: string,
  data: SuccessUserResponse,
  status: number
): void => {
  res
    .cookie("user_token", token, {
      sameSite: "none",
      secure: true,
      expires: new Date(Date.now() + 360000000),
      httpOnly: false,
    })
    .status(status)
    .json(data);
};
