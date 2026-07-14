import type { Request } from "express";
export interface CustomRequest extends Request {
    user?: {
        id: string;
        role?: string;
    };
}
export interface DecodedTokenType {
    id: string;
    role: string;
    iat?: number;
    exp?: number;
}
export interface ErrorWithStatus extends Error {
    statusCode?: number;
}
//# sourceMappingURL=index.d.ts.map