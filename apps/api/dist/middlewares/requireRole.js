import newError from "../utils/newError.js";
import { User } from "../models/user.model.js";
const requireRole = (...roles) => {
    return async (req, _res, next) => {
        try {
            if (!req.user?.id) {
                throw newError({ message: "Not authenticated", statusCode: 401 });
            }
            const user = await User.findById(req.user.id);
            if (!user) {
                throw newError({ message: "User not found", statusCode: 404 });
            }
            if (!roles.includes(user.role)) {
                throw newError({ message: "Forbidden: insufficient permissions", statusCode: 403 });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
export default requireRole;
//# sourceMappingURL=requireRole.js.map