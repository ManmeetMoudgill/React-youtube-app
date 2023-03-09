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
exports.deleteVideoComment = exports.insertVideoComment = exports.getVideoComments = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const http_errors_1 = __importDefault(require("http-errors"));
const getVideoComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //getting the videoId
        const { id: videoId } = req.params;
        const comments = yield Comment_1.default.find({ videoId: videoId });
        if (!comments)
            return next((0, http_errors_1.default)(400, "No comments found!"));
        res.status(200).json({
            success: true,
            comments,
            status: 200,
            message: "Comments fetched successfully!",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getVideoComments = getVideoComments;
const insertVideoComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //getting the videoId
        const { id: videoId } = req.params;
        //getting the userId from the request
        const { _id } = req === null || req === void 0 ? void 0 : req.user;
        const comment = new Comment_1.default(Object.assign({ userId: _id, videoId }, req.body));
        if (!comment)
            return next((0, http_errors_1.default)(400, "Something went wrong!"));
        yield comment.save();
        res.status(200).json({
            success: true,
            status: 200,
            message: "Comment added successfully!",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.insertVideoComment = insertVideoComment;
const deleteVideoComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //getting the videoId
    const { videoId, commentId } = req.params;
    //getting the userId from the request
    const { _id } = req === null || req === void 0 ? void 0 : req.user;
    const comment = yield Comment_1.default.findOne({
        videoId: videoId,
        _id: commentId,
    });
    if (!comment)
        return next((0, http_errors_1.default)(400, "No comments found!"));
    if (comment.userId !== (_id === null || _id === void 0 ? void 0 : _id.toString()))
        return next((0, http_errors_1.default)(400, "You are not authorized to delete this comment!"));
    yield comment.delete();
    res.status(200).json({
        success: true,
        status: 200,
        message: "Comment deleted successfully!",
    });
});
exports.deleteVideoComment = deleteVideoComment;
