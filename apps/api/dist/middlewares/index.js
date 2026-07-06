import cors from "cors";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
const middlewares = (app) => {
    app.use(express.json());
    app.use(morgan("dev"));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(cors({
        origin: ["http://localhost:3000", "https://bookora.vercel.app"],
        credentials: true,
        exposedHeaders: ["Content-Disposition"],
    }));
};
export default middlewares;
//# sourceMappingURL=index.js.map