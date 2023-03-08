import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../types/auth";
import Comment, { CommentModelType } from "../models/Comment";
import createHttpError from "http-errors";

export const getVideoComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //getting the videoId
    const { id: videoId } = req.params;

    const comments = await Comment.find<CommentModelType>({ videoId: videoId });
    if (!comments) return next(createHttpError(400, "No comments found!"));

    res.status(200).json({
      success: true,
      comments,
      status: 200,
      message: "Comments fetched successfully!",
    });
  } catch (err) {
    next(err);
  }
};

export const insertVideoComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //getting the videoId
    const { id: videoId } = req.params;

    //getting the userId from the request
    const { _id } = (req as CustomRequest)?.user;

    const comment = new Comment({
      userId: _id,
      videoId,
      ...req.body,
    });

    if (!comment) return next(createHttpError(400, "Something went wrong!"));

    await comment.save();
    res.status(200).json({
      success: true,
      status: 200,
      message: "Comment added successfully!",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteVideoComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //getting the videoId
  const { videoId, commentId } = req.params;

  //getting the userId from the request
  const { _id } = (req as CustomRequest)?.user;

  const comment = await Comment.findOne<CommentModelType>({
    videoId: videoId,
    _id: commentId,
  });
  if (!comment) return next(createHttpError(400, "No comments found!"));

  if (comment.userId !== _id?.toString())
    return next(
      createHttpError(400, "You are not authorized to delete this comment!")
    );

  await comment.delete();

  res.status(200).json({
    success: true,
    status: 200,
    message: "Comment deleted successfully!",
  });
};
