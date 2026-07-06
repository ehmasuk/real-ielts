import type { Request, Response, NextFunction } from "express";
import type { CustomRequest } from "../types/index.js";
export declare const createBugReport: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllBugReports: (_req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const markBugReportAsFixed: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteBugReport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=bug-report.controller.d.ts.map