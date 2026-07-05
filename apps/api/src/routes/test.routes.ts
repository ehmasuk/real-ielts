import express from "express";
import { getTests, getTestByIdHandler, getTestPartHandler, submitTestPartHandler, getPartResultHandler, getUserResultsHandler } from "../controllers/test.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { validate } from "../middlewares/validate.js";
import { submitAnswersSchema } from "../validations/index.js";

const router: express.Router = express.Router();

router.get("/", getTests);
router.get("/user-results", isAuthenticated, getUserResultsHandler);
router.get("/:id/part/:partNum/result", isAuthenticated, getPartResultHandler);
router.post("/:id/part/:partNum/submit", isAuthenticated, validate(submitAnswersSchema), submitTestPartHandler);
router.get("/:id/part/:partNum", getTestPartHandler);
router.get("/:id", getTestByIdHandler);

export default router;
