import type { Request, Response, NextFunction } from "express";
type AsyncFunction = (req: Request | any, res: Response, next: NextFunction) => Promise<any>;
/**
 * Wraps async Express controllers to automatically catch errors and pass them to the global error handler.
 * This removes the need for repetitive try/catch blocks in every controller.
 */
declare const catchAsync: (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => void;
export default catchAsync;
//# sourceMappingURL=catchAsync.d.ts.map