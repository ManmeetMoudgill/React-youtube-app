import express from "express";
import { verifyToken } from "../middlewares/verify-user";
import {
  deleteVideoComment,
  getVideoComments,
  insertVideoComment,
} from "../controllers/comments";

const router = express.Router();

//get all comments of a video
router.get("/:id", getVideoComments);

//insert an comment;
router.post("/:id", verifyToken, insertVideoComment);

router.delete("/delete/:videoId/:commentId", verifyToken, deleteVideoComment);

export default router;
