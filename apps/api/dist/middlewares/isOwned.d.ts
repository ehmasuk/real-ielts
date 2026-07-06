import type { NextFunction, Response } from "express";
import type { CustomRequest } from "../types/index.js";
interface Params {
    model: any;
    paramName: string;
    ownerField: string;
}
declare const isOwned: ({ model, paramName, ownerField }: Params) => (req: CustomRequest, _res: Response, next: NextFunction) => Promise<void>;
export default isOwned;
//# sourceMappingURL=isOwned.d.ts.map