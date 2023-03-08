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
exports.googleAuth = exports.signIn = exports.signUp = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generate_token_1 = require("../utils/generate-token");
const return_user_1 = require("../utils/return-user");
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //hasing the password
        var salt = bcryptjs_1.default.genSaltSync(10);
        var hash = bcryptjs_1.default.hashSync(`${req.body.password}`, salt);
        const user = new User_1.default(Object.assign(Object.assign({}, req.body), { password: hash }));
        const successResponse = {
            success: true,
            message: "User has been created",
            status: 200,
            user: (0, return_user_1.transformedUser)(user),
        };
        yield user.save();
        //generating token
        const token = user === null || user === void 0 ? void 0 : user.generateAuthToken();
        (0, generate_token_1.saveToCookiesAndSendResponse)(res, token, successResponse, 200);
    }
    catch (err) {
        next(err);
    }
});
exports.signUp = signUp;
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const invalidCredentials = {
            success: false,
            message: "Invaid Credentials",
            status: 400,
        };
        //check if email and password are provided
        if (!email || !password)
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
                status: 400,
            });
        //find the user by email
        const user = yield User_1.default.findOne({
            email,
        }).select("+password");
        //check if user exists
        if (!user)
            return res.status(400).json(invalidCredentials);
        //compare the password
        const isPasswordValid = bcryptjs_1.default.compareSync(password, user === null || user === void 0 ? void 0 : user.password);
        if (!isPasswordValid)
            return res.status(400).json(invalidCredentials);
        const successResponse = {
            success: true,
            message: "User has logged in successfully",
            status: 200,
            user: (0, return_user_1.transformedUser)(user),
        };
        //generating token
        const token = user === null || user === void 0 ? void 0 : user.generateAuthToken();
        (0, generate_token_1.saveToCookiesAndSendResponse)(res, token, successResponse, 200);
    }
    catch (err) {
        next(err);
    }
});
exports.signIn = signIn;
const googleAuth = (req, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //check if the user is already in the database
        const user = yield User_1.default.findOne({ email: req.body.email });
        if (user) {
            //generate token
            const token = user === null || user === void 0 ? void 0 : user.generateAuthToken();
            const successResponse = {
                success: true,
                message: "User has logged in successfully",
                status: 200,
                user: (0, return_user_1.transformedUser)(user),
            };
            (0, generate_token_1.saveToCookiesAndSendResponse)(response, token, successResponse, 200);
        }
        else {
            //create a new user
            const user = new User_1.default(Object.assign(Object.assign({}, req.body), { isGoogleAuth: true }));
            const successResponse = {
                success: true,
                message: "User has been created",
                status: 200,
                user: (0, return_user_1.transformedUser)(user),
            };
            //generate token
            yield user.save();
            const token = user === null || user === void 0 ? void 0 : user.generateAuthToken();
            (0, generate_token_1.saveToCookiesAndSendResponse)(response, token, successResponse, 200);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.googleAuth = googleAuth;
