import express from "express";
import drillProgressController from "../controllers/drill-progress.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { validate } from "../middlewares/validate.js";
import { updateDrillProgressSchema } from "../validations/index.js";
const router = express.Router();
router.get("/:drillId", isAuthenticated, drillProgressController.getProgress);
router.put("/:drillId", isAuthenticated, validate(updateDrillProgressSchema), drillProgressController.updateProgress);
router.delete("/:drillId", isAuthenticated, drillProgressController.resetProgress);
export default router;
//# sourceMappingURL=drill-progress.routes.js.map