import catchAsync from "../utils/catchAsync.js";
import successResponse from "../utils/successResponse.js";
import mockTestServices from "../services/mock-test/index.js";
export const startSession = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        throw new Error("Unauthorized");
    const { bookId, testNumber } = req.body;
    const session = await mockTestServices.startSession(userId, bookId, testNumber);
    successResponse({ res, statusCode: 200, message: "Mock test session started", data: session });
});
export const getSession = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        throw new Error("Unauthorized");
    const { sessionId } = req.params;
    const session = await mockTestServices.getSession(sessionId, userId);
    if (!session)
        throw new Error("Session not found");
    successResponse({ res, statusCode: 200, message: "Session retrieved", data: session });
});
export const getModuleContent = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        throw new Error("Unauthorized");
    const { sessionId, skill } = req.params;
    const content = await mockTestServices.getModuleContent(sessionId, userId, skill);
    if (!content)
        throw new Error("Content not found");
    successResponse({ res, statusCode: 200, message: "Module content retrieved", data: content });
});
export const submitModule = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        throw new Error("Unauthorized");
    const { sessionId, skill } = req.params;
    const { answers, timeTaken } = req.body;
    const session = await mockTestServices.submitModule(sessionId, userId, skill, answers || {}, timeTaken || 0);
    if (!session)
        throw new Error("Failed to submit module");
    successResponse({ res, statusCode: 200, message: "Module submitted successfully", data: session });
});
//# sourceMappingURL=mock-test.controller.js.map