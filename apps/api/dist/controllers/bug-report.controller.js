import bugReportServices from "../services/bug-report/index.js";
export const createBugReport = async (req, res, next) => {
    try {
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
    }
    catch (error) {
        next(error);
    }
};
export const getAllBugReports = async (_req, res, next) => {
    try {
        const reports = await bugReportServices.getAll();
        res.status(200).json(reports);
    }
    catch (error) {
        next(error);
    }
};
export const markBugReportAsFixed = async (req, res, next) => {
    try {
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
    }
    catch (error) {
        next(error);
    }
};
export const deleteBugReport = async (req, res, next) => {
    try {
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
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=bug-report.controller.js.map