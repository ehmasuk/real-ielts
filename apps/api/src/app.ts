import express, { type Express } from "express";
import connectDB from "./config/db.js";
import {
  catchGlobalErrors,
  notFound,
} from "./middlewares/globalErrorHandlers.js";
import middlewares from "./middlewares/index.js";
import routes from "./routes/index.js";

const app: Express = express();

// Connect to MongoDB at module load. Mongoose buffers queries until the
// connection resolves, so this is safe for both the local server and
// Vercel's serverless runtime (whichever entry file it picks — this file
// or src/index.ts).
void connectDB();

// load all middlewares
middlewares(app);

// load all routes
routes(app);

// catch not found routes and throw error
app.use(notFound);

// identify and throw global errors
app.use(catchGlobalErrors);

export default app;
