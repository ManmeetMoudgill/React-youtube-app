import { NextFunction, Request, Response } from "express";
import Video from "../models/Video";
import { CustomRequest } from "../types/auth";
import createHttpError from "http-errors";
import { VideoModelType } from "../models/Video";
import User, { UserModelType } from "../models/User";
import asyncMiddleware from "../middlewares/catch-async-errors";

export const createVideo = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const video = new Video<VideoModelType>({
      userId: (req as CustomRequest)?.user?._id,
      ...req.body,
    });

    const savedVideo = await video.save();

    if (!video) {
      return next(createHttpError(401, "Something went wrong, try again!"));
    }

    res.status(200).json({
      message: "video created successfully",
      status: 200,
      success: true,
      video: savedVideo,
    });
  }
);

export const updateVideo = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: videoId } = req.params;

    const { _id } = (req as CustomRequest)?.user;

    const video = await Video.findById<VideoModelType>(videoId);
    if (!video) next(createHttpError("401", "Video not found"));

    if (video?.userId?.toString() !== _id)
      next(createHttpError("401", "Unauthorized"));

    const updatedVideo = await Video.findByIdAndUpdate<VideoModelType>(
      videoId,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Video updated successfully",
      success: true,
      status: 200,
      video: updatedVideo,
    });
  }
);

export const getVideo = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) return next(createHttpError(400, "Video not found"));

    //fetch the user information who posted this video
    const user = await User.findOne<UserModelType>({ _id: video?.userId });

    video?.incrementViews();
    await video?.save();

    res.status(200).json({
      message: "Video fetched successfully",
      success: true,
      status: 400,
      data: {
        video,
        user,
      },
    });
  }
);

export const deleteVideo = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: videoId } = req.params;

    const { _id } = (req as CustomRequest)?.user;

    const video = await Video.findById<VideoModelType>(videoId);
    if (!video) next(createHttpError("401", "Video not found"));

    if (video?.userId?.toString() !== _id)
      next(createHttpError("401", "Unauthorized"));

    await Video.findByIdAndDelete<VideoModelType>(videoId);

    res.status(200).json({
      message: "Video deleted successfully",
      success: true,
      status: 200,
    });
  }
);

export const incrementViews = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    //getting the videoId

    const { id: videoId } = req.params;

    const video = await Video.findById<VideoModelType>(videoId);
    if (!video) next(createHttpError("401", "Video not found"));

    video?.incrementViews();
    await video?.save();
    res.status(200).json({
      success: true,
      status: 200,
      message: "Video views incremented",
    });
  }
);

export const getRandomVideos = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const videos = await Video.aggregate<VideoModelType>([
      {
        $sample: { size: 40 },
      },
    ]);

    //getting the user information on the bases of userId from video
    const videosWithUser = await Promise.all(
      videos.map(async (video) => {
        const user = await User.findById<UserModelType>(video?.userId);
        if (!user) next(createHttpError("401", "User not found"));
        return {
          ...video,
          user,
        };
      })
    );

    res.status(200).json({
      success: true,
      status: 200,
      videos: videosWithUser.flat(),
      message: "Random videos fetched successfully",
    });
  }
);

export const getTrendVideos = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const videos = await Video.find().sort({ views: -1 }).limit(40);

    res.status(200).json({
      success: true,
      status: 200,
      videos,
      message: "Trend videos fetched successfully",
    });
  }
);

export const subscribedChannelVideo = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    //get the id user who is lgged in
    const { _id } = (req as CustomRequest)?.user;

    //get the user subscribedUser
    const user = await User.findById<UserModelType>(_id);
    if (!user) next(createHttpError("401", "User not found"));

    const subscribedUsers: string[] | undefined = user?.subscribedUsers;
    if (!subscribedUsers)
      return next(createHttpError("401", "Subscribed Channels not found"));

    const list = await Promise.all(
      subscribedUsers?.map((channelId) => {
        return Video.find({ userId: channelId });
      })
    );

    res.status(200).json({
      success: true,
      status: 200,
      videos: list?.flat(),
    });
  }
);

export const getVideosByTags = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const { tags } = req.query;
    const tagsArray = (tags as string)?.split(",");

    const videos = await Video.find({ tags: { $in: tagsArray } }).limit(20);

    const list = await Promise.all(
      videos?.map(async (video) => {
        const user = await User.findById<UserModelType>(video?.userId);
        if (!user) next(createHttpError("401", "User not found"));
        return {
          video: video,
          user,
        };
      })
    );

    if (!list) next(createHttpError("401", "Videos not found"));

    res.status(200).json({
      success: true,
      message: "Videos by tags fetched successfully",
      status: 200,
      videos: list?.flat(),
    });
  }
);

export const searchVideos = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const { q } = req.query;

    const videos = await Video.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $in: q } },
      ],
    }).limit(20);

    if (!videos) next(createHttpError("401", "Videos not found"));

    res.status(200).json({
      success: true,
      message: "Videos by tags fetched successfully",
      status: 200,
      videos,
    });
  }
);
