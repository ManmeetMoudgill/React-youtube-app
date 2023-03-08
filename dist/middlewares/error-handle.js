"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandle = void 0;
const ErrorHandle = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    const errorResponse = {
        status,
        message,
        success: false,
    };
    return res.status(status).json(errorResponse);
};
exports.ErrorHandle = ErrorHandle;
