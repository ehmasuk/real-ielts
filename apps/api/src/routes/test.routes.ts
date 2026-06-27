import express from "express";
import { getTests, getTestByIdHandler, getTestPartHandler, submitTestPartHandler } from "../controllers/test.controller.js";

const router = express.Router();

router.get("/", getTests);
router.post("/:id/part/:partNum/submit", submitTestPartHandler);
router.get("/:id/part/:partNum", getTestPartHandler);
router.get("/:id", getTestByIdHandler);

export default router;
