import jwt from "jsonwebtoken";
import env from "../config/env.js";
export const signAccessToken = (payload) => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "30d" });
};
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, env.JWT_SECRET);
    }
    catch {
        return null;
    }
};
//# sourceMappingURL=tokenHandlers.js.map