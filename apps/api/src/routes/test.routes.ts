import express from "express";
import { getTests, getTestsList, getTestByIdHandler, getTestPartHandler, submitTestPartHandler, getPartResultHandler, getUserResultsHandler, getFullTestHandler, submitFullTestHandler, getFullTestResultHandler, getUserFullTestResultsHandler } from "../controllers/test.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { validate } from "../middlewares/validate.js";
import { submitAnswersSchema, submitFullTestSchema } from "../validations/index.js";

const router: express.Router = express.Router();

router.get("/", getTests);
router.get("/list", getTestsList);
router.get("/user-results", isAuthenticated, getUserResultsHandler);
router.get("/full-results", isAuthenticated, getUserFullTestResultsHandler);
router.get("/:id/part/:partNum/result", isAuthenticated, getPartResultHandler);
router.post("/:id/part/:partNum/submit", isAuthenticated, validate(submitAnswersSchema), submitTestPartHandler);
router.get("/:id/part/:partNum", getTestPartHandler);
router.get("/:id/full", getFullTestHandler);
router.post("/:id/full/submit", isAuthenticated, validate(submitFullTestSchema), submitFullTestHandler);
router.get("/:id/full/result", isAuthenticated, getFullTestResultHandler);
router.get("/:id", getTestByIdHandler);

export default router;
