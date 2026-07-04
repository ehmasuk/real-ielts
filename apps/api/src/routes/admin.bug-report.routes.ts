import express from "express"
import {
  getAllBugReports,
  markBugReportAsFixed,
  deleteBugReport,
} from "../controllers/bug-report.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import requireRole from "../middlewares/requireRole.js"

const router = express.Router()

router.use(isAuthenticated, requireRole("admin"))

router.get("/", getAllBugReports)
router.patch("/:id/fixed", markBugReportAsFixed)
router.delete("/:id", deleteBugReport)

export default router
