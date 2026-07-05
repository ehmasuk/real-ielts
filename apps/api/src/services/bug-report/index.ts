import { BugReport, type IBugReport } from "../../models/bug-report.model.js"

const bugReportServices = {
  create: (data: { userId: string; description: string }): Promise<IBugReport> => {
    return BugReport.create({
      userId: data.userId,
      description: data.description,
    })
  },

  getAll: (): Promise<IBugReport[]> => {
    return BugReport.find().sort({ createdAt: -1 }).populate("userId", "name email picture").lean()
  },

  markAsFixed: (id: string, fixed: boolean): Promise<IBugReport | null> => {
    return BugReport.findByIdAndUpdate(id, { fixed }, { returnDocument: "after" }).lean()
  },

  remove: (id: string): Promise<IBugReport | null> => {
    return BugReport.findByIdAndDelete(id).lean()
  },
}

export default bugReportServices
