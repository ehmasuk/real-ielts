import express from "express";
import {
  getAdminTests,
  getTestCount,
  getAdminTestByIdHandler,
  createTestHandler,
  updateTestHandler,
  deleteTestHandler,
  publishTestHandler,
  archiveTestHandler,
} from "../controllers/test.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import requireRole from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import { createTestSchema, updateTestSchema } from "../validations/index.js";

const router: express.Router = express.Router();

router.use(isAuthenticated, requireRole("admin"));

router.get("/", getAdminTests);
router.get("/count", getTestCount);
router.get("/:id", getAdminTestByIdHandler);
router.post("/", validate(createTestSchema), createTestHandler);
router.put("/:id", validate(updateTestSchema), updateTestHandler);
router.delete("/:id", deleteTestHandler);

// Status action shortcuts
router.patch("/:id/publish", publishTestHandler);
router.patch("/:id/archive", archiveTestHandler);

export default router;
