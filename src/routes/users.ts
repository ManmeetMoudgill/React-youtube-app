import express from "express";
import {
  getUsers,
  getUser,
  deleteUser,
  likeVideo,
  unSubscribeUser,
  subscribeUser,
  updateUser,
  unlikeVideo,
  getUserVideosHistory,
  insertUserVideosHistory,
  deleteVideosHistory,
} from "../controllers/users";
import { verifyToken } from "../middlewares/verify-user";

const router = express.Router();

// @route   GET api/users
router.get("/", getUsers);

// @route   GET api/users/find/:id
router.get("/find/:id", getUser);

// @route   PUT api/users/:id
router.put("/:id", verifyToken, updateUser);

//@route DELETE api/users/delete/:id
router.delete("/delete/:id", verifyToken, deleteUser);

// @route   PUT api/users/subscribe/:userId
router.put("/sub/:userId", verifyToken, subscribeUser);

// @route   PUT api/users/unsubscribe/:userId
router.put("/unsub/:userId", verifyToken, unSubscribeUser);

//like a vide
// @route   POST api/users/like/:videoId
router.post("/like/:videoId", verifyToken, likeVideo);

// @route   POST api/users/unlike/:videoId
router.post("/dislike/:videoId", verifyToken, unlikeVideo);

router.post("/videosHistory", verifyToken, insertUserVideosHistory);

router.get("/videosHistory/:id", verifyToken, getUserVideosHistory);

router.delete("/videosHistory/:id", verifyToken, deleteVideosHistory);
export default router;
