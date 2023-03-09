"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideosHistory = exports.getUserVideosHistory = exports.insertUserVideosHistory = exports.deleteUser = exports.updateUser = exports.unlikeVideo = exports.likeVideo = exports.unSubscribeUser = exports.subscribeUser = exports.getUser = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const http_errors_1 = __importDefault(require("http-errors"));
const return_user_1 = require("../utils/return-user");
const Video_1 = __importDefault(require("../models/Video"));
const VideosHistory_1 = require("../models/VideosHistory");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        if (!users || users.length === 0) {
            res.status(200).json({ message: "No users found" });
        }
        {
            res.status(200).json({
                message: "Users found",
                users,
            });
        }
    }
    catch (error) {
        res.status(404).json({ message: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.getUsers = getUsers;
//get a user by id
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User_1.default.findById((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
        if (!user)
            return next((0, http_errors_1.default)(402, "User not found"));
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user: (0, return_user_1.transformedUser)(user),
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getUser = getUser;
//subscribe a another user
const subscribeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId: channelId } = req.params;
        const { _id } = req === null || req === void 0 ? void 0 : req.user;
        yield User_1.default.findByIdAndUpdate(_id, {
            $push: { subscribedUsers: channelId },
        });
        yield User_1.default.findByIdAndUpdate(channelId, {
            $inc: { subscribers: 1 },
        });
        res.status(200).json({
            success: true,
            message: "Subscription Successfull",
            status: 200,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.subscribeUser = subscribeUser;
//unsubscribe a another user
const unSubscribeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId: channelId } = req.params;
        const { _id } = req === null || req === void 0 ? void 0 : req.user;
        yield User_1.default.findByIdAndUpdate(_id, {
            $pull: { subscribedUsers: channelId },
        });
        //Decrement the subscribers of the channel
        yield User_1.default.findByIdAndUpdate(channelId, {
            $inc: { subscribers: -1 },
        });
        res.status(200).json({
            success: true,
            message: "Unsubscription Successfull",
            status: 200,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.unSubscribeUser = unSubscribeUser;
//like a video
const likeVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.params;
        const { _id } = req === null || req === void 0 ? void 0 : req.user;
        const video = yield Video_1.default.findById(videoId);
        video === null || video === void 0 ? void 0 : video.userLikeTheVideo(_id);
        yield (video === null || video === void 0 ? void 0 : video.save());
        res.status(200).json({
            success: true,
            status: 200,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.likeVideo = likeVideo;
//unlike a video
const unlikeVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.params;
        const { _id } = req === null || req === void 0 ? void 0 : req.user;
        const video = yield Video_1.default.findById(videoId);
        video === null || video === void 0 ? void 0 : video.userDislikeTheVideo(_id);
        yield (video === null || video === void 0 ? void 0 : video.save());
        res.status(200).json({
            success: true,
            status: 200,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.unlikeVideo = unlikeVideo;
//update a user
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    if (((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id) === null || _c === void 0 ? void 0 : _c.toString()) !== ((_d = req.params) === null || _d === void 0 ? void 0 : _d.id)) {
        return next((0, http_errors_1.default)(401, "Unauthorized"));
    }
    try {
        const updatedUser = yield User_1.default.findByIdAndUpdate((_e = req.params) === null || _e === void 0 ? void 0 : _e.id, {
            $set: req.body,
        }, {
            new: true,
        });
        res.status(200).json({
            success: true,
            status: 201,
            message: "User updated successfully",
            updatedUser,
        });
        if (!updatedUser)
            return next((0, http_errors_1.default)(404, "User not found"));
    }
    catch (err) {
        next(err);
    }
});
exports.updateUser = updateUser;
//delete a user by id
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h, _j;
    if (((_f = req.params) === null || _f === void 0 ? void 0 : _f.id) !== ((_h = (_g = req === null || req === void 0 ? void 0 : req.user) === null || _g === void 0 ? void 0 : _g._id) === null || _h === void 0 ? void 0 : _h.toString()))
        return next((0, http_errors_1.default)(401, "Unauthorized"));
    try {
        yield User_1.default.findByIdAndDelete((_j = req.params) === null || _j === void 0 ? void 0 : _j.id);
        res.status(200).json({
            success: true,
            status: 201,
            message: "User has been deleted successfully",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteUser = deleteUser;
const insertUserVideosHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videoHistoryFound = yield VideosHistory_1.VideoHistoryModel.findOne({
            videoId: req.body.videoId,
            userId: req.body.userId,
        });
        if (videoHistoryFound) {
            return res.status(200).json({
                success: true,
                status: 201,
                message: "Video already in history",
            });
        }
        const videoHistory = new VideosHistory_1.VideoHistoryModel(Object.assign({}, req.body));
        yield videoHistory.save();
        if (!videoHistory)
            return next((0, http_errors_1.default)(404, "Something wen wrong"));
        res.status(200).json({
            success: true,
            status: 201,
            message: "Video  inserted  into history successfully",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.insertUserVideosHistory = insertUserVideosHistory;
const getUserVideosHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const videosHistory = yield VideosHistory_1.VideoHistoryModel.find({
            userId: id,
        });
        const list = yield Promise.all(videosHistory.map((video) => __awaiter(void 0, void 0, void 0, function* () {
            const VideoData = yield Video_1.default.findOne({
                _id: video.videoId,
            });
            if (!VideoData)
                return next((0, http_errors_1.default)(404, "Video not found"));
            return {
                video: VideoData,
                userId: video.userId,
                watchedAt: video.watchedAt,
                _id: video._id,
            };
        })));
        if (!videosHistory) {
            return res.status(200).json({
                success: true,
                status: 201,
                message: "No videos found in history",
            });
        }
        res.status(200).json({
            success: true,
            status: 201,
            message: "Videos found in history",
            videosHistory: list,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getUserVideosHistory = getUserVideosHistory;
const deleteVideosHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get the videoHistory id from the request params
        const { id } = req.params;
        //find the videoHistory by id
        yield VideosHistory_1.VideoHistoryModel.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            status: 201,
            message: "Video history deleted successfully",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteVideosHistory = deleteVideosHistory;
