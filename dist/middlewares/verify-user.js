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
exports.verifyToken = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_token } = req === null || req === void 0 ? void 0 : req.cookies;
    if (!user_token) {
        return next((0, http_errors_1.default)(401, "Unauthorized"));
    }
    //verify the token
    const decoded = jsonwebtoken_1.default.verify(user_token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
        return next((0, http_errors_1.default)(401, "Token is not valid"));
    }
    //find the user
    const user = yield User_1.default.findOne({ _id: decoded === null || decoded === void 0 ? void 0 : decoded._id });
    if (!user) {
        return next((0, http_errors_1.default)(401, "User not found"));
    }
    req.user = user;
    next();
});
exports.verifyToken = verifyToken;
