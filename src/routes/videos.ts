import express from "express";
import { verifyToken } from "../middlewares/verify-user";
import {
  createVideo,
  getVideo,
  deleteVideo,
  updateVideo,
  incrementViews,
  getRandomVideos,
  getTrendVideos,
  subscribedChannelVideo,
  getVideosByTags,
  searchVideos,
} from "../controllers/videos";

const router = express.Router();

router.post("/", verifyToken, createVideo);
router.get("/find/:id", getVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.put("/:id", verifyToken, updateVideo);
router.put("/views/:id", incrementViews);
router.get("/random", getRandomVideos);
router.get("/trend", getTrendVideos);
router.get("/sub", verifyToken, subscribedChannelVideo);
router.get("/search", searchVideos);
router.get("/tags", getVideosByTags);

export default router;
