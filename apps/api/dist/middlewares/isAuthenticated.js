import newError from "../utils/newError.js";
import { verifyToken } from "../utils/tokenHandlers.js";
const isAuthenticated = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw newError({ message: "Please login first", statusCode: 401 });
        }
        const token = authHeader?.split(" ")[1];
        if (!token) {
            throw newError({ message: "Please login first", statusCode: 401 });
        }
        const validUser = verifyToken(token);
        if (!validUser) {
            throw newError({ message: "Invalid or expired token", statusCode: 401 });
        }
        req.user = { id: validUser.id, role: validUser.role };
        next();
    }
    catch (error) {
        next(error);
    }
};
export default isAuthenticated;
//# sourceMappingURL=isAuthenticated.js.map