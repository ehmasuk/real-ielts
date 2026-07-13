import type { Request, Response, NextFunction } from "express";

type AsyncFunction = (req: Request | any, res: Response, next: NextFunction) => Promise<any>;

/**
 * Wraps async Express controllers to automatically catch errors and pass them to the global error handler.
 * This removes the need for repetitive try/catch blocks in every controller.
 */
const catchAsync = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;
