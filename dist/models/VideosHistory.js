"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoHistoryModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const videoHistorySchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
    },
    videoId: {
        type: String,
        required: true,
    },
    watchedAt: {
        type: String,
        required: true,
    },
});
exports.VideoHistoryModel = mongoose_1.default.model("VideoHistory", videoHistorySchema);
