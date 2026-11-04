import type { NextFunction, Request, Response } from "express";
/**
 * Rejects requests whose path parameter is not a valid MongoDB ObjectId.
 *
 * Without this, a malformed id reaches Mongoose and throws a CastError,
 * which surfaces as a 500 instead of a 400 and pollutes the error logs.
 *
 * Usage: router.param("id", validateObjectId("id"))
 */
declare const validateObjectId: (paramName: string) => (req: Request, _res: Response, next: NextFunction) => void;
export default validateObjectId;
//# sourceMappingURL=validateObjectId.d.ts.map