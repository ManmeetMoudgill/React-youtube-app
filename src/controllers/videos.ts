import { NextFunction, Request, Response } from "express";
import Video from "../models/Video";
import { CustomRequest } from "../types/auth";
import createHttpError from "http-errors";
import { VideoModelType } from "../models/Video";
import User, { UserModelType } from "../models/User";
import asyncMiddleware from "../middlewares/catch-async-errors";
import ApiFeatures from "../utils/fetaures";
import { ROWS_PER_PAGE } from "../constants";

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
    const count = await new ApiFeatures(Video.find(), req.query).query;

    const videosFeature = new ApiFeatures(Video.find(), req.query);

    videosFeature.pagination(ROWS_PER_PAGE);
    const videos = await videosFeature.query;
    const response = videos as VideoModelType[];

    //getting the user information on the bases of userId from video
    const videosWithUser = await Promise.all(
      response.map(async (video) => {
        const user = await User.findById<UserModelType>(video?.userId);
        if (!user) return;
        return {
          video,
          user,
        };
      })
    );

    res.status(200).json({
      success: true,
      status: 200,
      videos: videosWithUser.flat()?.filter((video) => video),
      count: count.length,
      message: "Random videos fetched successfully",
    });
  }
);

export const getTrendVideos = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const count = await new ApiFeatures(Video.find(), req.query).query;

    const videosFeature = new ApiFeatures(Video.find(), req.query);

    videosFeature.pagination(ROWS_PER_PAGE);

    const videos = await videosFeature.query;
    const response = videos as VideoModelType[];
    console.log(response?.length);

    //getting the user information on the bases of userId from video
    const videosWithUser = await Promise.all(
      response.map(async (video) => {
        const user = await User.findById<UserModelType>(video?.userId);
        //if user not found then return skip
        if (!user) return;

        return {
          video,
          user,
        };
      })
    );

    res.status(200).json({
      success: true,
      status: 200,
      videos: videosWithUser.flat()?.filter((video) => video),
      count: count.length,
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
      subscribedUsers?.map(async (channelId) => {
        const VideosFeature = new ApiFeatures(
          Video.findOne({ userId: channelId }),
          req.query
        );

        VideosFeature.pagination(ROWS_PER_PAGE);
        const video = await VideosFeature.query;
        if (!video) return;
        return {
          video,
          user,
        };
      })
    );

    res.status(200).json({
      success: true,
      status: 200,
      videos: list?.flat().filter((video) => video),
    });
  }
);

export const getVideosByTags = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const { tags } = req.query;
    const tagsArray = (tags as string)?.split(",");

    const count = await new ApiFeatures(
      Video.find({ tags: { $in: tagsArray } }),
      req.query
    ).query;

    const videosFeature = new ApiFeatures(
      Video.find({ tags: { $in: tagsArray } }),
      req.query
    );

    videosFeature.pagination(ROWS_PER_PAGE);
    const response = await videosFeature.query;

    const videos = response as VideoModelType[];
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
      count: count.length,
      videos: list?.flat(),
    });
  }
);

export const searchVideos = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const totalCounts = await new ApiFeatures(Video.find(), req.query).search()
      .query;

    const videosFeature = new ApiFeatures(Video.find(), req.query).search();

    videosFeature.pagination(ROWS_PER_PAGE);

    const videos = await videosFeature.query;
    if (!videos) next(createHttpError("401", "Videos not found"));

    res.status(200).json({
      success: true,
      message: "Videos by tags fetched successfully",
      status: 200,
      totalVideos: totalCounts.length,
      videos,
    });
  }
);
