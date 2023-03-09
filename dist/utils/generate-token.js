"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToCookiesAndSendResponse = void 0;
const saveToCookiesAndSendResponse = (res, token, data, status) => {
    res
        .cookie("user_token", token, {
        sameSite: "none",
        secure: true,
    })
        .status(status)
        .json(data);
};
exports.saveToCookiesAndSendResponse = saveToCookiesAndSendResponse;
