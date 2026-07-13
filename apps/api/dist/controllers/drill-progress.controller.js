import drillProgressServices from "../services/drill-progress/index.js";
import catchAsync from "../utils/catchAsync.js";
import successResponse from "../utils/successResponse.js";
import newError from "../utils/newError.js";
const getProgress = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { drillId } = req.params;
    if (!drillId)
        throw newError({ message: "drillId is required", statusCode: 400 });
    const progress = await drillProgressServices.get(userId, drillId);
    successResponse({ res, data: progress ?? { currentLevel: 1, completedLevels: [], stars: {}, bestAccuracy: 0, totalAttempts: 0 } });
});
const updateProgress = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { drillId } = req.params;
    if (!drillId)
        throw newError({ message: "drillId is required", statusCode: 400 });
    const { levelNumber, stars, accuracy } = req.body;
    const progress = await drillProgressServices.upsert(userId, drillId, { levelNumber, stars, accuracy });
    successResponse({ res, data: progress, message: "Progress updated" });
});
const resetProgress = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { drillId } = req.params;
    if (!drillId)
        throw newError({ message: "drillId is required", statusCode: 400 });
    await drillProgressServices.reset(userId, drillId);
    successResponse({ res, message: "Progress reset" });
});
export default { getProgress, updateProgress, resetProgress };
//# sourceMappingURL=drill-progress.controller.js.map