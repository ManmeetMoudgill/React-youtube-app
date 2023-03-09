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
exports.searchVideos = exports.getVideosByTags = exports.subscribedChannelVideo = exports.getTrendVideos = exports.getRandomVideos = exports.incrementViews = exports.deleteVideo = exports.getVideo = exports.updateVideo = exports.createVideo = void 0;
const Video_1 = __importDefault(require("../models/Video"));
const http_errors_1 = __importDefault(require("http-errors"));
const User_1 = __importDefault(require("../models/User"));
const createVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const video = new Video_1.default(Object.assign({ userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id }, req.body));
        const savedVideo = yield video.save();
        if (!video) {
            return next((0, http_errors_1.default)(401, "Something went wrong, try again!"));
        }
        res.status(200).json({
            message: "video created successfully",
            status: 200,
            success: true,
            video: savedVideo,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createVideo = createVideo;
const updateVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { id: videoId } = req.params;
        const { _id } = req === null || req === void 0 ? void 0 : req.user;
        const video = yield Video_1.default.findById(videoId);
        if (!video)
            next((0, http_errors_1.default)("401", "Video not found"));
        if (((_b = video === null || video === void 0 ? void 0 : video.userId) === null || _b === void 0 ? void 0 : _b.toString()) !== _id)
            next((0, http_errors_1.default)("401", "Unauthorized"));
        const updatedVideo = yield Video_1.default.findByIdAndUpdate(videoId, {
            $set: req.body,
        }, {
            new: true,
        });
        res.status(200).json({
            message: "Video updated successfully",
            success: true,
            status: 200,
            video: updatedVideo,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateVideo = updateVideo;
const getVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: videoId } = req.params;
    try {
        const video = yield Video_1.default.findById(videoId);
        if (!video)
            return next((0, http_errors_1.default)(400, "Video not found"));
        //fetch the user information who posted this video
        const user = yield User_1.default.findOne({ _id: video === null || video === void 0 ? void 0 : video.userId });
        video === null || video === void 0 ? void 0 : video.incrementViews();
        yield (video === null || video === void 0 ? void 0 : video.save());
        res.status(200).json({
            message: "Video fetched successfully",
            success: true,
            status: 400,
            data: {
                video,
                user,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getVideo = getVideo;
const deleteVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { id: videoId } = req.params;
        const { _id } = req === null || req === void 0 ? void 0 : req.user;
        const video = yield Video_1.default.findById(videoId);
        if (!video)
            next((0, http_errors_1.default)("401", "Video not found"));
        if (((_c = video === null || video === void 0 ? void 0 : video.userId) === null || _c === void 0 ? void 0 : _c.toString()) !== _id)
            next((0, http_errors_1.default)("401", "Unauthorized"));
        yield Video_1.default.findByIdAndDelete(videoId);
        res.status(200).json({
            message: "Video deleted successfully",
            success: true,
            status: 200,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteVideo = deleteVideo;
const incrementViews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //getting the videoId
    try {
        const { id: videoId } = req.params;
        const video = yield Video_1.default.findById(videoId);
        if (!video)
            next((0, http_errors_1.default)("401", "Video not found"));
        video === null || video === void 0 ? void 0 : video.incrementViews();
        yield (video === null || video === void 0 ? void 0 : video.save());
        res.status(200).json({
            success: true,
            status: 200,
            message: "Video views incremented",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.incrementViews = incrementViews;
const getRandomVideos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videos = yield Video_1.default.aggregate([
            {
                $sample: { size: 40 },
            },
        ]);
        //getting the user information on the bases of userId from video
        const videosWithUser = yield Promise.all(videos.map((video) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield User_1.default.findById(video === null || video === void 0 ? void 0 : video.userId);
            if (!user)
                next((0, http_errors_1.default)("401", "User not found"));
            return Object.assign(Object.assign({}, video), { user });
        })));
        res.status(200).json({
            success: true,
            status: 200,
            videos: videosWithUser.flat(),
            message: "Random videos fetched successfully",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getRandomVideos = getRandomVideos;
const getTrendVideos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videos = yield Video_1.default.find().sort({ views: -1 }).limit(40);
        res.status(200).json({
            success: true,
            status: 200,
            videos,
            message: "Trend videos fetched successfully",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getTrendVideos = getTrendVideos;
const subscribedChannelVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get the id user who is lgged in
    const { _id } = req === null || req === void 0 ? void 0 : req.user;
    //get the user subscribedUser
    const user = yield User_1.default.findById(_id);
    if (!user)
        next((0, http_errors_1.default)("401", "User not found"));
    const subscribedUsers = user === null || user === void 0 ? void 0 : user.subscribedUsers;
    if (!subscribedUsers)
        return next((0, http_errors_1.default)("401", "Subscribed Channels not found"));
    const list = yield Promise.all(subscribedUsers === null || subscribedUsers === void 0 ? void 0 : subscribedUsers.map((channelId) => {
        return Video_1.default.find({ userId: channelId });
    }));
    res.status(200).json({
        success: true,
        status: 200,
        videos: list === null || list === void 0 ? void 0 : list.flat(),
    });
});
exports.subscribedChannelVideo = subscribedChannelVideo;
const getVideosByTags = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { tags } = req.query;
    const tagsArray = tags === null || tags === void 0 ? void 0 : tags.split(",");
    const videos = yield Video_1.default.find({ tags: { $in: tagsArray } }).limit(20);
    const list = yield Promise.all(videos === null || videos === void 0 ? void 0 : videos.map((video) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_1.default.findById(video === null || video === void 0 ? void 0 : video.userId);
        if (!user)
            next((0, http_errors_1.default)("401", "User not found"));
        return {
            video: video,
            user,
        };
    })));
    if (!list)
        next((0, http_errors_1.default)("401", "Videos not found"));
    res.status(200).json({
        success: true,
        message: "Videos by tags fetched successfully",
        status: 200,
        videos: list === null || list === void 0 ? void 0 : list.flat(),
    });
});
exports.getVideosByTags = getVideosByTags;
const searchVideos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.query;
    const videos = yield Video_1.default.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
            { tags: { $in: q } },
        ],
    }).limit(20);
    if (!videos)
        next((0, http_errors_1.default)("401", "Videos not found"));
    res.status(200).json({
        success: true,
        message: "Videos by tags fetched successfully",
        status: 200,
        videos,
    });
});
exports.searchVideos = searchVideos;
