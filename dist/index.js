"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connect_to_db_1 = __importDefault(require("./connection/connect-to-db"));
const dotenv = __importStar(require("dotenv"));
const users_1 = __importDefault(require("./routes/users"));
const videos_1 = __importDefault(require("./routes/videos"));
const comments_1 = __importDefault(require("./routes/comments"));
const auth_1 = __importDefault(require("./routes/auth"));
const error_handle_1 = require("./middlewares/error-handle");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const __PORT__ = 8000;
const app = (0, express_1.default)();
dotenv.config({
    path: __dirname + "/.env",
});
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/api/users", users_1.default);
app.use("/api/videos", videos_1.default);
app.use("/api/comments", comments_1.default);
app.use("/api/auth", auth_1.default);
//Middleware for error handling
app.use(error_handle_1.ErrorHandle);
app.listen(__PORT__, () => {
    (0, connect_to_db_1.default)();
    console.log(`Server is running on port ${__PORT__}`);
});
