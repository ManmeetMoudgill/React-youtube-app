"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_user_1 = require("../middlewares/verify-user");
const comments_1 = require("../controllers/comments");
const router = express_1.default.Router();
//get all comments of a video
router.get("/:id", comments_1.getVideoComments);
//insert an comment;
router.post("/:id", verify_user_1.verifyToken, comments_1.insertVideoComment);
router.delete("/delete/:videoId/:commentId", verify_user_1.verifyToken, comments_1.deleteVideoComment);
exports.default = router;
