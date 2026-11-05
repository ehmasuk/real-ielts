import cors from "cors";
import crypto from "crypto";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import env from "../config/env.js";
import type { Express, Request, RequestHandler } from "express";
// express-rate-limit ships a real named `rateLimit` export, which resolves
// correctly under every TypeScript mode (a default import of it breaks
// Vercel's build-time type-checker).
import { rateLimit } from "express-rate-limit";
// helmet only exports its middleware as the module's default export. Vercel's
// build-time type-checker infers that default from helmet's CJS entry, where
// `module.exports.default = module.exports` makes `.default` type as the
// module itself (non-callable). Import the namespace and assert the shape
// that is always true at runtime: `.default` is the middleware factory (both
// the ESM build's `export { helmet as default }` and the CJS build's
// `module.exports.default = module.exports` guarantee it).
import * as helmetModule from "helmet";

type HelmetFactory = (options?: Record<string, unknown>) => RequestHandler;

const helmet = (helmetModule as unknown as { default: HelmetFactory }).default;

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
    skip: (req: Request) => req.path.startsWith("/auth"),
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

  // Attach a request id to every response so error responses (which echo it
  // back) can be traced to a specific request.
  app.use((_req, res, next) => {
    res.setHeader("x-request-id", crypto.randomUUID());
    next();
  });

  // Body size limits
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  // Log the path only in production — the "dev"/URL formats include the query
  // string, which would put things like admin search terms (emails) in logs.
  morgan.token("path", (req) => (req as express.Request).path);
  app.use(
    morgan(isDev ? "dev" : ":method :path :status :res[content-length] - :response-time ms"),
  );
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
