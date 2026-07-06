import { ZodError } from "zod";
import newError from "../utils/newError.js";
const notFound = (_req, _res, next) => {
    const error = newError({ message: "Route not found", statusCode: 404 });
    next(error);
};
const catchGlobalErrors = (err, _req, res, _next) => {
    // global error consoler, it must be removed in prod server
    console.log(err);
    if (err instanceof ZodError) {
        const message = err.issues.map((e) => `${e.path.join(".")} : ${e.message}`).join(", ");
        return res.status(400).json({ code: 400, message, requestId: res.getHeader("x-request-id") });
    }
    // Handle Mongoose duplicate key errors
    if (err.name === "MongoServerError" && err.code === 11000) {
        return res.status(409).json({
            code: 409,
            message: "This record already exists. Please check for duplicates.",
            requestId: res.getHeader("x-request-id"),
        });
    }
    // if there is a statusCode that means its our newError
    if (err.statusCode) {
        const { statusCode, message } = err;
        return res.status(statusCode).json({
            code: statusCode,
            message: message,
            requestId: res.getHeader("x-request-id"),
        });
    }
    // if there is no statusCode that means its not our newError, so there is a internal server error
    // add error in log
    // logger.error({ err, requestId: res.getHeader("x-request-id") });
    return res.status(500).json({
        code: 500,
        message: "Internal server error",
        requestId: res.getHeader("x-request-id"),
    });
};
export { catchGlobalErrors, notFound };
//# sourceMappingURL=globalErrorHandlers.js.map