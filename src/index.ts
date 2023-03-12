import express from "express";
import connectToDb from "./connection/connect-to-db";
import * as dotenv from "dotenv";
import userRoutes from "./routes/users";
import videoRoutes from "./routes/videos";
import commentRoutes from "./routes/comments";
import authRoutes from "./routes/auth";
import { ErrorHandle } from "./middlewares/error-handle";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoDbErrorHandler from "./middlewares/mongodb-error";
//cath the unHandledRejection and restart the server
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! Shutting down...");
  process.exit(1);
});

//cath the unCaughtException and restart the server
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception! Shutting down...");
  process.exit(1);
});

const __PORT__ = 8000;
const app = express();
app.use(cors());
dotenv.config({
  path: __dirname + "/.env",
});
app.use(cookieParser());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

//Middleware for error handling
app.use(ErrorHandle);
app.use(mongoDbErrorHandler);

app.listen(__PORT__, (): void => {
  connectToDb();
  console.log(`Server is running on port ${__PORT__}`);
});
