import type { NextFunction, Response } from "express";
import type { CustomRequest } from "../types/index.js";
declare const isAuthenticated: (req: CustomRequest, _res: Response, next: NextFunction) => Promise<void>;
export default isAuthenticated;
//# sourceMappingURL=isAuthenticated.d.ts.map