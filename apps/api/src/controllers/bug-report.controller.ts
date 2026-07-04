import type { Request, Response, NextFunction } from "express"
import type { CustomRequest } from "../types/index.js"
import bugReportServices from "../services/bug-report/index.js"

export const createBugReport = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { description } = req.body
    if (!description) {
      res.status(400).json({ message: "Description is required" })
      return
    }
    const report = await bugReportServices.create({
      userId: req.user!.id,
      description,
    })
    res.status(201).json(report)
  } catch (error) {
    next(error)
  }
}

export const getAllBugReports = async (_req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const reports = await bugReportServices.getAll()
    res.status(200).json(reports)
  } catch (error) {
    next(error)
  }
}

export const markBugReportAsFixed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fixed } = req.body
    const report = await bugReportServices.markAsFixed(req.params.id, fixed)
    if (!report) {
      res.status(404).json({ message: "Bug report not found" })
      return
    }
    res.status(200).json(report)
  } catch (error) {
    next(error)
  }
}

export const deleteBugReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await bugReportServices.remove(req.params.id)
    if (!report) {
      res.status(404).json({ message: "Bug report not found" })
      return
    }
    res.status(200).json({ message: "Bug report deleted" })
  } catch (error) {
    next(error)
  }
}
