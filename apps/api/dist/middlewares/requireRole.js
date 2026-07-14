import newError from "../utils/newError.js";
const requireRole = (...roles) => {
    return (req, _res, next) => {
        try {
            if (!req.user?.id) {
                throw newError({ message: "Not authenticated", statusCode: 401 });
            }
            if (!req.user.role || !roles.includes(req.user.role)) {
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