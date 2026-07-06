import type { DecodedTokenType } from "../types/index.js";
export declare const signAccessToken: (payload: {
    id: string;
    role: string;
}) => string;
export declare const verifyToken: (token: string) => DecodedTokenType | null;
//# sourceMappingURL=tokenHandlers.d.ts.map