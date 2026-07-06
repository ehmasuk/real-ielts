import type { Response, NextFunction } from "express";
import type { CustomRequest } from "../types/index.js";
export declare const getAllMedia: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createMedia: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateMedia: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteMedia: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=media.controller.d.ts.map