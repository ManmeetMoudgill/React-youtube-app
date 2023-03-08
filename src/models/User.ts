import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserAuth } from "../types/auth";
//export the Type of the User

export type UserModelType = UserAuth &
  mongoose.Document & {
    password: string;
    generateAuthToken: () => string;
    incrementSubscribers: () => void;
    decrementSubscribers: () => void;
  };
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    img: {
      type: String,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedUsers: {
      type: [String],
    },
    isGoogleAuth: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, email: this.email },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

export default mongoose.model<UserModelType>("User", userSchema);
