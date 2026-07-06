import type { Request, Response, NextFunction } from "express";
export declare const getBooks: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAdminBooks: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAdminBookById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createBookHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateBookHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteBookHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=book.controller.d.ts.map