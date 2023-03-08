"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToCookiesAndSendResponse = void 0;
const saveToCookiesAndSendResponse = (res, token, data, status) => {
    res
        .cookie("user_token", token, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
    })
        .status(status)
        .json(data);
};
exports.saveToCookiesAndSendResponse = saveToCookiesAndSendResponse;
