"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const verify_user_1 = require("../middlewares/verify-user");
const router = express_1.default.Router();
// @route   GET api/users
router.get("/", users_1.getUsers);
// @route   GET api/users/find/:id
router.get("/find/:id", users_1.getUser);
// @route   PUT api/users/:id
router.put("/:id", verify_user_1.verifyToken, users_1.updateUser);
//@route DELETE api/users/delete/:id
router.delete("/delete/:id", verify_user_1.verifyToken, users_1.deleteUser);
// @route   PUT api/users/subscribe/:userId
router.put("/sub/:userId", verify_user_1.verifyToken, users_1.subscribeUser);
// @route   PUT api/users/unsubscribe/:userId
router.put("/unsub/:userId", verify_user_1.verifyToken, users_1.unSubscribeUser);
//like a vide
// @route   POST api/users/like/:videoId
router.post("/like/:videoId", verify_user_1.verifyToken, users_1.likeVideo);
// @route   POST api/users/unlike/:videoId
router.post("/dislike/:videoId", verify_user_1.verifyToken, users_1.unlikeVideo);
router.post("/videosHistory", verify_user_1.verifyToken, users_1.insertUserVideosHistory);
router.get("/videosHistory/:id", verify_user_1.verifyToken, users_1.getUserVideosHistory);
router.delete("/videosHistory/:id", verify_user_1.verifyToken, users_1.deleteVideosHistory);
exports.default = router;
