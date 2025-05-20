import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

import { connectDB } from "./db/connectDB.js";
import authRouter from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.NODE_ENV || "development";
dotenv.config({ path: path.resolve(process.cwd(), "config.env") });

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} on ${ENVIRONMENT} mode!`);
  connectDB();
});
