import { Response, Request, NextFunction } from "express";
import User, { UserModelType } from "../models/User";
import { CustomRequest } from "../types/auth";
import createError from "http-errors";
import { transformedUser } from "../utils/return-user";
import Video, { VideoModelType } from "../models/Video";
import { VideoHistoryModel } from "../models/VideosHistory";
import asyncMiddleware from "../middlewares/catch-async-errors";

export const getUsers = asyncMiddleware(async (req: Request, res: Response) => {
  const users = await User.find();
  if (!users || users.length === 0) {
    res.status(200).json({ message: "No users found" });
  }
  {
    res.status(200).json({
      message: "Users found",
      users,
    });
  }
});

//get a user by id
export const getUser = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req?.params?.id);
    if (!user) return next(createError(402, "User not found"));

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: transformedUser(user),
    });
  }
);

//subscribe a another user
export const subscribeUser = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId: channelId } = req.params;

    const { _id } = (req as CustomRequest)?.user;

    await User.findByIdAndUpdate(_id, {
      $push: { subscribedUsers: channelId },
    });

    await User.findByIdAndUpdate(channelId, {
      $inc: { subscribers: 1 },
    });

    res.status(200).json({
      success: true,
      message: "Subscription Successfull",
      status: 200,
    });
  }
);

//unsubscribe a another user
export const unSubscribeUser = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId: channelId } = req.params;

    const { _id } = (req as CustomRequest)?.user;

    await User.findByIdAndUpdate(_id, {
      $pull: { subscribedUsers: channelId },
    });

    //Decrement the subscribers of the channel
    await User.findByIdAndUpdate(channelId, {
      $inc: { subscribers: -1 },
    });

    res.status(200).json({
      success: true,
      message: "Unsubscription Successfull",
      status: 200,
    });
  }
);

//like a video
export const likeVideo = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.params;

    const { _id } = (req as CustomRequest)?.user;

    const video = await Video.findById<VideoModelType>(videoId);

    video?.userLikeTheVideo(_id);

    await video?.save();
    res.status(200).json({
      success: true,
      status: 200,
    });
  }
);

//unlike a video
export const unlikeVideo = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.params;

    const { _id } = (req as CustomRequest)?.user;

    const video = await Video.findById<VideoModelType>(videoId);

    video?.userDislikeTheVideo(_id);
    await video?.save();
    res.status(200).json({
      success: true,
      status: 200,
    });
  }
);

//update a user

export const updateUser = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    if ((req as CustomRequest)?.user?._id?.toString() !== req.params?.id) {
      return next(createError(401, "Unauthorized"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params?.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      status: 201,
      message: "User updated successfully",
      updatedUser,
    });
    if (!updatedUser) return next(createError(404, "User not found"));
  }
);

//delete a user by id
export const deleteUser = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.params?.id !== (req as CustomRequest)?.user?._id?.toString())
      return next(createError(401, "Unauthorized"));

    await User.findByIdAndDelete(req.params?.id);

    res.status(200).json({
      success: true,
      status: 201,
      message: "User has been deleted successfully",
    });
  }
);

export const insertUserVideosHistory = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const videoHistoryFound = await VideoHistoryModel.findOne({
      videoId: req.body.videoId,
      userId: req.body.userId,
    });

    if (videoHistoryFound) {
      return res.status(200).json({
        success: true,
        status: 201,
        message: "Video already in history",
      });
    }

    const videoHistory = new VideoHistoryModel({ ...req.body });
    await videoHistory.save();
    if (!videoHistory) return next(createError(404, "Something wen wrong"));
    res.status(200).json({
      success: true,
      status: 201,
      message: "Video  inserted  into history successfully",
    });
  }
);

export const getUserVideosHistory = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const videosHistory = await VideoHistoryModel.find({
      userId: id,
    });

    const list = await Promise.all(
      videosHistory.map(async (video) => {
        const VideoData = await Video.findOne<VideoModelType>({
          _id: video.videoId,
        });
        //if currrent item video is not found them got to next iteration
        if (!VideoData) return;
        return {
          video: VideoData,
          userId: video.userId,
          watchedAt: video.watchedAt,
          _id: video._id,
        };
      })
    );

    if (list) {
      res.status(200).json({
        success: true,
        status: 201,
        message: "Videos found in history",
        videosHistory: list.filter((item) => item !== undefined),
      });
    }
  }
);

export const deleteVideosHistory = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    //get the videoHistory id from the request params
    const { id } = req.params;

    //find the videoHistory by id
    await VideoHistoryModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      status: 201,
      message: "Video history deleted successfully",
    });
  }
);
