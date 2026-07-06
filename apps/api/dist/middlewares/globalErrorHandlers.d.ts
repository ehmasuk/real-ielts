import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
declare const notFound: (_req: Request, _res: Response, next: NextFunction) => void;
declare const catchGlobalErrors: ErrorRequestHandler;
export { catchGlobalErrors, notFound };
//# sourceMappingURL=globalErrorHandlers.d.ts.map