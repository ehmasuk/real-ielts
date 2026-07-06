import { BugReport } from "../../models/bug-report.model.js";
const bugReportServices = {
    create: (data) => {
        return BugReport.create({
            userId: data.userId,
            description: data.description,
        });
    },
    getAll: () => {
        return BugReport.find().sort({ createdAt: -1 }).populate("userId", "name email picture").lean();
    },
    markAsFixed: (id, fixed) => {
        return BugReport.findByIdAndUpdate(id, { fixed }, { returnDocument: "after" }).lean();
    },
    remove: (id) => {
        return BugReport.findByIdAndDelete(id).lean();
    },
};
export default bugReportServices;
//# sourceMappingURL=index.js.map