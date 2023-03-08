"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformedUser = void 0;
const transformedUser = (user) => {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        img: user.img,
        subscribers: user.subscribers,
        subscribedUsers: user.subscribedUsers,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};
exports.transformedUser = transformedUser;
