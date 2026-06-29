import express from "express";
import { getTests, getTestByIdHandler, getTestPartHandler, submitTestPartHandler, getPartResultHandler, getUserResultsHandler } from "../controllers/test.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/", getTests);
router.get("/user-results", isAuthenticated, getUserResultsHandler);
router.get("/:id/part/:partNum/result", isAuthenticated, getPartResultHandler);
router.post("/:id/part/:partNum/submit", isAuthenticated, submitTestPartHandler);
router.get("/:id/part/:partNum", getTestPartHandler);
router.get("/:id", getTestByIdHandler);

export default router;
