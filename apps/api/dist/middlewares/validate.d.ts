import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
export declare function validate(schema: z.ZodTypeAny): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.d.ts.map