import type { NextFunction, Response } from "express";
import type { CustomRequest } from "../types/index.js";
declare const requireRole: (...roles: string[]) => (req: CustomRequest, _res: Response, next: NextFunction) => void;
export default requireRole;
//# sourceMappingURL=requireRole.d.ts.map