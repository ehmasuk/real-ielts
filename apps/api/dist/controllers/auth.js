import authServices from "../services/auth/index.js";
import newError from "../utils/newError.js";
import successResponse from "../utils/successResponse.js";
import env from "../config/env.js";
import catchAsync from "../utils/catchAsync.js";
const sync = catchAsync(async (req, res) => {
    const apiKey = req.headers["x-internal-api-key"];
    if (apiKey !== env.INTERNAL_API_KEY) {
        throw newError({ message: "Forbidden", statusCode: 403 });
    }
    const { sub, email, name, picture } = req.body;
    if (!sub)
        throw newError({ message: "sub is required", statusCode: 400 });
    const result = await authServices.sync({ sub, email, name, picture });
    successResponse({ res, data: { token: result.token, user: result.user }, message: "User synced successfully" });
});
const me = catchAsync(async (req, res) => {
    if (!req.user?.id)
        throw newError({ message: "Not authenticated", statusCode: 401 });
    const user = await authServices.getMe(req.user.id);
    successResponse({ res, data: user, message: "User fetched" });
});
export default {
    sync,
    me,
};
//# sourceMappingURL=auth.js.map