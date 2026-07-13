import bugReportServices from "../services/bug-report/index.js";
import catchAsync from "../utils/catchAsync.js";
export const createBugReport = catchAsync(async (req, res) => {
    const { description } = req.body;
    if (!description) {
        res.status(400).json({ message: "Description is required" });
        return;
    }
    const report = await bugReportServices.create({
        userId: req.user.id,
        description,
    });
    res.status(201).json(report);
});
export const getAllBugReports = catchAsync(async (_req, res) => {
    const reports = await bugReportServices.getAll();
    res.status(200).json(reports);
});
export const markBugReportAsFixed = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ message: "Missing bug report id" });
        return;
    }
    const { fixed } = req.body;
    const report = await bugReportServices.markAsFixed(id, fixed);
    if (!report) {
        res.status(404).json({ message: "Bug report not found" });
        return;
    }
    res.status(200).json(report);
});
export const deleteBugReport = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ message: "Missing bug report id" });
        return;
    }
    const report = await bugReportServices.remove(id);
    if (!report) {
        res.status(404).json({ message: "Bug report not found" });
        return;
    }
    res.status(200).json({ message: "Bug report deleted" });
});
//# sourceMappingURL=bug-report.controller.js.map