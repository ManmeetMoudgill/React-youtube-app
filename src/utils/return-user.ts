import { UserModelType } from "../models/User";
import { UserAuth } from "../types/auth";

export const transformedUser = (user: UserModelType): UserAuth => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    img: user.img,
    subscribers: user.subscribers,
    subscribedUsers: user.subscribedUsers,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
