"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToCookiesAndSendResponse = void 0;
const saveToCookiesAndSendResponse = (res, token, data, status) => {
    res
        .cookie("user_token", token, {
        sameSite: "none",
        secure: true,
        expires: new Date(Date.now() + 360000000),
        httpOnly: false,
    })
        .status(status)
        .json(data);
};
exports.saveToCookiesAndSendResponse = saveToCookiesAndSendResponse;
