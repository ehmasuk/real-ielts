import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import env from "../config/env.js";
import type { Express } from "express";

const middlewares = (app: Express): void => {
  const isDev = process.env.NODE_ENV !== "production";

  // Security headers. CSP is disabled — this is a JSON-only API — and CORP is
  // set to cross-origin so the frontend can embed any media the API may serve
  // (e.g. audio) directly in the browser.
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );

  // Vercel (and any reverse proxy) terminates the connection and forwards the
  // real client IP in X-Forwarded-For. Without "trust proxy", req.ip is the
  // proxy's IP, so the rate limiters below would key every visitor into one
  // shared bucket (or be trivially bypassable). Exactly one hop is trusted.
  // In dev there is no proxy, so keep the default (off) — otherwise the IP
  // could be spoofed via a hand-crafted X-Forwarded-For header.
  if (!isDev) {
    app.set("trust proxy", 1);
  }

  // Rate limiting — applies to all /api routes except /auth (see below).
  // Dev gets a much bigger budget: page loads + react-query fetches can
  // easily exceed 100 requests in the window while iterating, and a 429 here
  // breaks NextAuth's POST /auth/sync at sign-in time (login deadlock until
  // the API server is restarted to reset the in-memory counter).
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isDev ? 1000 : 100, // limit each IP to n requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { code: 429, message: "Too many requests, please try again later." },
    skip: (req) => req.path.startsWith("/auth"),
  });
  app.use("/api", limiter);

  // Auth bridge endpoints (/auth/sync, /auth/me) are excluded above because
  // /auth/sync runs exactly once per Google sign-in — inside NextAuth's jwt
  // callback — where a 429 would make every future request unauthenticated.
  // It is not brute-forceable (requires x-internal-api-key), so a separate
  // generous limiter is enough protection here.
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 500 : 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: { code: 429, message: "Too many requests, please try again later." },
  });
  app.use("/api/auth", authLimiter);

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
