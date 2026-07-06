import express from "express";
import { createBugReport } from "../controllers/bug-report.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { validate } from "../middlewares/validate.js";
import { createBugReportSchema } from "../validations/index.js";
const router = express.Router();
router.post("/", isAuthenticated, validate(createBugReportSchema), createBugReport);
export default router;
//# sourceMappingURL=bug-report.routes.js.map