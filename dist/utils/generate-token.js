"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToCookiesAndSendResponse = void 0;
const saveToCookiesAndSendResponse = (res, token, data, status) => {
    res
        .cookie("user_token", token, {
        sameSite: "none",
        secure: true,
        expires: new Date(Date.now() + 3600000),
    })
        .status(status)
        .json(data);
};
exports.saveToCookiesAndSendResponse = saveToCookiesAndSendResponse;
