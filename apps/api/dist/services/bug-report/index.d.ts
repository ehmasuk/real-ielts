import { type IBugReport } from "../../models/bug-report.model.js";
declare const bugReportServices: {
    create: (data: {
        userId: string;
        description: string;
    }) => Promise<IBugReport>;
    getAll: () => Promise<IBugReport[]>;
    markAsFixed: (id: string, fixed: boolean) => Promise<IBugReport | null>;
    remove: (id: string) => Promise<IBugReport | null>;
};
export default bugReportServices;
//# sourceMappingURL=index.d.ts.map