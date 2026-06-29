import express from "express";
import {
  getAdminTests,
  getAdminTestByIdHandler,
  createTestHandler,
  updateTestHandler,
  deleteTestHandler,
  publishTestHandler,
  archiveTestHandler,
} from "../controllers/test.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import requireRole from "../middlewares/requireRole.js";

const router = express.Router();

router.use(isAuthenticated, requireRole("admin"));

router.get("/", getAdminTests);
router.get("/:id", getAdminTestByIdHandler);
router.post("/", createTestHandler);
router.put("/:id", updateTestHandler);
router.delete("/:id", deleteTestHandler);

// Status action shortcuts
router.patch("/:id/publish", publishTestHandler);
router.patch("/:id/archive", archiveTestHandler);

export default router;
