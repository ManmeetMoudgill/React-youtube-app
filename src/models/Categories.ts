import mongoose from "mongoose";
import { Category } from "../types/Category";

export type CategoryModelType = Category & mongoose.Document;

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<CategoryModelType>("Category", categorySchema);
