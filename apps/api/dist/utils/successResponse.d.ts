import type { Response } from "express";
interface SuccessResponseParams {
    res: Response;
    statusCode?: number;
    message?: string;
    data?: unknown;
    extra?: object;
}
declare const successResponse: ({ res, statusCode, message, data, extra, }: SuccessResponseParams) => Response;
export default successResponse;
//# sourceMappingURL=successResponse.d.ts.map