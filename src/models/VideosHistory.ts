import mongoose from "mongoose";
import { VideoHistory } from "../types/video-history";

type VideohistoryModelType = VideoHistory & mongoose.Document;

const videoHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  },
  watchedAt: {
    type: String,
    required: true,
  },
});

export const VideoHistoryModel = mongoose.model<VideohistoryModelType>(
  "VideoHistory",
  videoHistorySchema
);
