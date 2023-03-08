import { Response, Request, NextFunction } from "express";
import User, { UserModelType } from "../models/User";
import { CustomRequest } from "../types/auth";
import createError from "http-errors";
import { transformedUser } from "../utils/return-user";
import Video, { VideoModelType } from "../models/Video";
import { VideoHistoryModel } from "../models/VideosHistory";
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error) {
    res.status(404).json({ message: (error as Error)?.message });
  }
};

//get a user by id
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req?.params?.id);
    if (!user) return next(createError(402, "User not found"));

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: transformedUser(user),
    });
  } catch (err) {
    next(err);
  }
};

//subscribe a another user
export const subscribeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

//unsubscribe a another user
export const unSubscribeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

//like a video
export const likeVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { videoId } = req.params;

    const { _id } = (req as CustomRequest)?.user;

    const video = await Video.findById<VideoModelType>(videoId);

    video?.userLikeTheVideo(_id);

    await video?.save();
    res.status(200).json({
      success: true,
      status: 200,
    });
  } catch (err) {
    next(err);
  }
};

//unlike a video
export const unlikeVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { videoId } = req.params;

    const { _id } = (req as CustomRequest)?.user;

    const video = await Video.findById<VideoModelType>(videoId);

    video?.userDislikeTheVideo(_id);
    await video?.save();
    res.status(200).json({
      success: true,
      status: 200,
    });
  } catch (err) {
    next(err);
  }
};

//update a user

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as CustomRequest)?.user?._id?.toString() !== req.params?.id) {
    return next(createError(401, "Unauthorized"));
  }

  try {
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
  } catch (err) {
    next(err);
  }
};

//delete a user by id
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.params?.id !== (req as CustomRequest)?.user?._id?.toString())
    return next(createError(401, "Unauthorized"));

  try {
    await User.findByIdAndDelete(req.params?.id);

    res.status(200).json({
      success: true,
      status: 201,
      message: "User has been deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const insertUserVideosHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

export const getUserVideosHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const videosHistory = await VideoHistoryModel.find({
      userId: id,
    });

    const list = await Promise.all(
      videosHistory.map(async (video) => {
        const VideoData = await Video.findOne<VideoModelType>({
          _id: video.videoId,
        });
        if (!VideoData) return next(createError(404, "Video not found"));
        return {
          video: VideoData,
          userId: video.userId,
          watchedAt: video.watchedAt,
          _id: video._id,
        };
      })
    );

    if (!videosHistory) {
      return res.status(200).json({
        success: true,
        status: 201,
        message: "No videos found in history",
      });
    }
    res.status(200).json({
      success: true,
      status: 201,
      message: "Videos found in history",
      videosHistory: list,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteVideosHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get the videoHistory id from the request params
    const { id } = req.params;

    //find the videoHistory by id
    await VideoHistoryModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      status: 201,
      message: "Video history deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
