import cors from "cors";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import env from "../config/env.js";
import type { Express } from "express";

const middlewares = (app: Express): void => {
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { code: 429, message: "Too many requests, please try again later." },
  });
  app.use("/api", limiter);

  // Body size limits
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(morgan("dev"));
  app.use(cookieParser());
  app.use(
    cors({
      origin: env.FRONTEND_URL.split(",").map((o) => o.trim()),
      credentials: true,
      exposedHeaders: ["Content-Disposition"],
    }),
  );
};

export default middlewares;
