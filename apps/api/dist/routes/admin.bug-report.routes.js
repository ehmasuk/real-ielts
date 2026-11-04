import express from "express";
import { getAllBugReports, markBugReportAsFixed, deleteBugReport, } from "../controllers/bug-report.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import requireRole from "../middlewares/requireRole.js";
import validateObjectId from "../middlewares/validateObjectId.js";
import { validate } from "../middlewares/validate.js";
import { markBugFixedSchema } from "../validations/index.js";
const router = express.Router();
router.use(isAuthenticated, requireRole("admin"));
router.param("id", validateObjectId("id"));
router.get("/", getAllBugReports);
router.patch("/:id/fixed", validate(markBugFixedSchema), markBugReportAsFixed);
router.delete("/:id", deleteBugReport);
export default router;
//# sourceMappingURL=admin.bug-report.routes.js.map