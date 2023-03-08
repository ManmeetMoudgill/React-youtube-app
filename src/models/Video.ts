import mongoose from "mongoose";
import { IVideo } from "../types/video";

export type VideoModelType = IVideo &
  mongoose.Document & {
    userLikeTheVideo: (userId: string) => void;
    userDislikeTheVideo: (userId: string) => void;
    incrementViews: () => void;
  };

const videoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: [String],
      default: [],
    },
    dislikes: {
      type: [String],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

videoSchema.methods.userLikeTheVideo = async function (userId: string) {
  await this.updateOne({
    $addToSet: { likes: userId },
    $pull: { dislikes: userId },
  });
};

videoSchema.methods.userDislikeTheVideo = async function (userId: string) {
  await this.updateOne({
    $addToSet: { dislikes: userId },
    $pull: { likes: userId },
  });
};

videoSchema.methods.incrementViews = async function () {
  await this.updateOne({
    $inc: { views: 1 },
  });
};

export default mongoose.model<VideoModelType>("Video", videoSchema);
