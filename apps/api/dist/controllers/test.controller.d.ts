import type { Request, Response, NextFunction } from "express";
import type { CustomRequest } from "../types/index.js";
export declare const getAdminTests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAdminTestByIdHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createTestHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateTestHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteTestHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const publishTestHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const archiveTestHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTestByIdHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTestPartHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const submitTestPartHandler: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserResultsHandler: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getPartResultHandler: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=test.controller.d.ts.map