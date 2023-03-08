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
const mongoose_1 = __importDefault(require("mongoose"));
const videoSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    tags: {
        type: [String],
        default: [],
    },
    likes: {
        type: [String],
        default: [],
    },
    dislikes: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});
videoSchema.methods.userLikeTheVideo = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.updateOne({
            $addToSet: { likes: userId },
            $pull: { dislikes: userId },
        });
    });
};
videoSchema.methods.userDislikeTheVideo = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.updateOne({
            $addToSet: { dislikes: userId },
            $pull: { likes: userId },
        });
    });
};
videoSchema.methods.incrementViews = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.updateOne({
            $inc: { views: 1 },
        });
    });
};
exports.default = mongoose_1.default.model("Video", videoSchema);
