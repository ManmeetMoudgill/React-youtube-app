import mongoose from "mongoose";
import { Comment } from "../types/comment";

export type CommentModelType = Comment & mongoose.Document;

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
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

export default mongoose.model<CommentModelType>("Comment", commentSchema);
