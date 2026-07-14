import mongoose from "mongoose";
import { Test } from "../models/test.model.js";
import testServices from "../services/test/index.js";
import catchAsync from "../utils/catchAsync.js";
// ─── Admin Endpoints ────────────────────────────────────────────────────────
// @desc    Get all tests (admin) — filterable by bookId
// @route   GET /api/admin/tests?bookId=<id>
// @access  Private (Admin)
export const getAdminTests = catchAsync(async (req, res) => {
    const tests = await testServices.getAllAdmin(req.query.bookId);
    res.status(200).json(tests);
});
// @desc    Get test count (admin)
// @route   GET /api/admin/tests/count
// @access  Private (Admin)
export const getTestCount = catchAsync(async (req, res) => {
    const count = await testServices.countAll();
    res.status(200).json({ count });
});
// @desc    Get a single test by ID (admin) — includes answerJson
// @route   GET /api/admin/tests/:id
// @access  Private (Admin)
export const getAdminTestByIdHandler = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400);
        throw new Error("Missing test id");
    }
    const test = await testServices.getByIdAdmin(id);
    if (!test) {
        res.status(404);
        throw new Error("Test not found");
    }
    res.status(200).json(test);
});
// @desc    Create a new test
// @route   POST /api/admin/tests
// @access  Private (Admin)
export const createTestHandler = catchAsync(async (req, res) => {
    const { bookId, testNumber, skill, status, contentJson, answerJson } = req.body;
    const test = await testServices.create({ bookId, testNumber, skill, status, contentJson, answerJson });
    res.status(201).json(test);
});
// @desc    Update a test
// @route   PUT /api/admin/tests/:id
// @access  Private (Admin)
export const updateTestHandler = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400);
        throw new Error("Missing test id");
    }
    const { bookId, testNumber, skill, status, contentJson, answerJson } = req.body;
    const test = await testServices.update(id, { bookId, testNumber, skill, status, contentJson, answerJson });
    if (!test) {
        res.status(404);
        throw new Error("Test not found");
    }
    res.status(200).json(test);
});
// @desc    Delete a test
// @route   DELETE /api/admin/tests/:id
// @access  Private (Admin)
export const deleteTestHandler = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400);
        throw new Error("Missing test id");
    }
    const test = await testServices.remove(id);
    if (!test) {
        res.status(404);
        throw new Error("Test not found");
    }
    res.status(200).json({ message: "Test removed successfully" });
});
// @desc    Publish a test
// @route   PATCH /api/admin/tests/:id/publish
// @access  Private (Admin)
export const publishTestHandler = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400);
        throw new Error("Missing test id");
    }
    const test = await testServices.setStatus(id, "published");
    if (!test) {
        res.status(404);
        throw new Error("Test not found");
    }
    res.status(200).json(test);
});
// @desc    Archive a test
// @route   PATCH /api/admin/tests/:id/archive
// @access  Private (Admin)
export const archiveTestHandler = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400);
        throw new Error("Missing test id");
    }
    const test = await testServices.setStatus(id, "archived");
    if (!test) {
        res.status(404);
        throw new Error("Test not found");
    }
    res.status(200).json(test);
});
// ─── Public Endpoints ────────────────────────────────────────────────────────
// @desc    Get all published tests — answerJson excluded
// @route   GET /api/tests?bookId=<id>
// @access  Public
export const getTests = catchAsync(async (req, res) => {
    const filters = {};
    if (req.query.bookId)
        filters.bookId = req.query.bookId;
    if (req.query.skill)
        filters.skill = req.query.skill;
    const tests = await testServices.getAll(filters);
    res.status(200).json(tests);
});
// @desc    Get all published tests — lightweight (no contentJson/answerJson)
// @route   GET /api/tests/list?skill=<skill>
// @access  Public
export const getTestsList = catchAsync(async (req, res) => {
    const filters = {};
    if (req.query.bookId)
        filters.bookId = req.query.bookId;
    if (req.query.skill)
        filters.skill = req.query.skill;
    const tests = await testServices.getAllLightweight(filters);
    res.status(200).json(tests);
});
// @desc    Get a single published test — answerJson excluded
// @route   GET /api/tests/:id
// @access  Public
export const getTestByIdHandler = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400);
        throw new Error("Missing test id");
    }
    const test = await testServices.getById(id);
    if (!test) {
        res.status(404);
        throw new Error("Test not found");
    }
    res.status(200).json(test);
});
// @desc    Get a single part/section of a published test
// @route   GET /api/tests/:id/part/:partNum
// @access  Public
export const getTestPartHandler = catchAsync(async (req, res) => {
    const id = req.params.id;
    const partNum = req.params.partNum;
    if (!id || !partNum) {
        res.status(400);
        throw new Error("Missing test id or part number");
    }
    const partIndex = parseInt(partNum, 10) - 1;
    const result = await testServices.getPart(id, partIndex);
    if (!result) {
        res.status(404);
        throw new Error("Test or part not found");
    }
    res.status(200).json(result);
});
// @desc    Submit answers for a single part and get results
// @route   POST /api/tests/:id/part/:partNum/submit
// @access  Authenticated
export const submitTestPartHandler = catchAsync(async (req, res) => {
    if (!req.user?.id) {
        res.status(401);
        throw new Error("Please login first");
    }
    const id = req.params.id;
    const partNum = req.params.partNum;
    if (!id || !partNum) {
        res.status(400);
        throw new Error("Missing test id or part number");
    }
    const partIndex = parseInt(partNum, 10) - 1;
    const { answers, timeTaken } = req.body;
    if (!answers || typeof answers !== "object") {
        res.status(400);
        throw new Error("Missing or invalid 'answers' object in request body");
    }
    const result = await testServices.submitPart(req.user.id, id, partIndex, answers, timeTaken);
    if (!result) {
        res.status(404);
        throw new Error("Test or part not found");
    }
    res.status(200).json(result);
});
// @desc    Get all results for the current user
// @route   GET /api/tests/user-results
// @access  Authenticated
export const getUserResultsHandler = catchAsync(async (req, res) => {
    if (!req.user?.id) {
        res.status(401);
        throw new Error("Please login first");
    }
    const results = await testServices.getUserResults(req.user.id);
    res.status(200).json(results);
});
// @desc    Get saved result for a test part
// @route   GET /api/tests/:id/part/:partNum/result
// @access  Authenticated
export const getPartResultHandler = catchAsync(async (req, res) => {
    if (!req.user?.id) {
        res.status(401);
        throw new Error("Please login first");
    }
    const id = req.params.id;
    const partNum = req.params.partNum;
    if (!id || !partNum) {
        res.status(400);
        throw new Error("Missing test id or part number");
    }
    const partIndex = parseInt(partNum, 10) - 1;
    const result = await testServices.getPartResult(req.user.id, id, partIndex);
    if (!result) {
        res.status(200).json(null);
        return;
    }
    res.status(200).json(result);
});
// ─── Full Test Endpoints ─────────────────────────────────────────────────────
// @desc    Get all sections of a published test (full test mode)
// @route   GET /api/tests/:id/full
// @access  Public
export const getFullTestHandler = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400);
        throw new Error("Missing test id");
    }
    const result = await testServices.getFullTest(id);
    if (!result) {
        res.status(404);
        throw new Error("Test not found");
    }
    res.status(200).json(result);
});
// @desc    Submit all parts of a full test and get combined results
// @route   POST /api/tests/:id/full/submit
// @access  Authenticated
export const submitFullTestHandler = catchAsync(async (req, res) => {
    if (!req.user?.id) {
        res.status(401);
        throw new Error("Please login first");
    }
    const id = req.params.id;
    if (!id) {
        res.status(400);
        throw new Error("Missing test id");
    }
    const { allAnswers, timeTaken, mode } = req.body;
    if (!allAnswers || typeof allAnswers !== "object") {
        res.status(400);
        throw new Error("Missing or invalid 'allAnswers' object in request body");
    }
    // Determine skill from test (lightweight query)
    const testDoc = await Test.findOne({ _id: new mongoose.Types.ObjectId(id) }, { skill: 1 }).lean();
    if (!testDoc) {
        res.status(404);
        throw new Error("Test not found");
    }
    const result = await testServices.submitFullTest(req.user.id, id, testDoc.skill, allAnswers, timeTaken, mode);
    if (!result) {
        res.status(404);
        throw new Error("Failed to submit full test");
    }
    res.status(200).json(result);
});
// @desc    Get saved full test result
// @route   GET /api/tests/:id/full/result
// @access  Authenticated
export const getFullTestResultHandler = catchAsync(async (req, res) => {
    if (!req.user?.id) {
        res.status(401);
        throw new Error("Please login first");
    }
    const id = req.params.id;
    if (!id) {
        res.status(400);
        throw new Error("Missing test id");
    }
    const skill = req.query.skill;
    if (!skill || !["listening", "reading"].includes(skill)) {
        res.status(400);
        throw new Error("Missing or invalid 'skill' query parameter");
    }
    const result = await testServices.getFullTestResult(req.user.id, id, skill);
    if (!result) {
        res.status(200).json(null);
        return;
    }
    res.status(200).json(result);
});
// @desc    Get all full test results for the current user
// @route   GET /api/tests/full-results
// @access  Authenticated
export const getUserFullTestResultsHandler = catchAsync(async (req, res) => {
    if (!req.user?.id) {
        res.status(401);
        throw new Error("Please login first");
    }
    const results = await testServices.getUserFullTestResults(req.user.id);
    res.status(200).json(results);
});
//# sourceMappingURL=test.controller.js.map