import type { NextFunction, Request, Response } from "express";
import type { CustomRequest } from "../types/index.js";
declare const _default: {
    sync: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    me: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
};
export default _default;
//# sourceMappingURL=auth.d.ts.map