import type { Request, Response, NextFunction } from "express";
import testServices from "../services/test/index.js";

// ─── Admin Endpoints ────────────────────────────────────────────────────────

// @desc    Get all tests (admin) — filterable by bookId
// @route   GET /api/admin/tests?bookId=<id>
// @access  Private (Admin)
export const getAdminTests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tests = await testServices.getAllAdmin(req.query.bookId as string | undefined);
    res.status(200).json(tests);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single test by ID (admin) — includes answerJson
// @route   GET /api/admin/tests/:id
// @access  Private (Admin)
export const getAdminTestByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const test = await testServices.getByIdAdmin(req.params.id);
    if (!test) {
      res.status(404);
      throw new Error("Test not found");
    }
    res.status(200).json(test);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new test
// @route   POST /api/admin/tests
// @access  Private (Admin)
export const createTestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId, testNumber, skill, status, contentJson, answerJson } = req.body;
    const test = await testServices.create({ bookId, testNumber, skill, status, contentJson, answerJson });
    res.status(201).json(test);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a test
// @route   PUT /api/admin/tests/:id
// @access  Private (Admin)
export const updateTestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId, testNumber, skill, status, contentJson, answerJson } = req.body;
    const test = await testServices.update(req.params.id, { bookId, testNumber, skill, status, contentJson, answerJson });
    if (!test) {
      res.status(404);
      throw new Error("Test not found");
    }
    res.status(200).json(test);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a test
// @route   DELETE /api/admin/tests/:id
// @access  Private (Admin)
export const deleteTestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const test = await testServices.remove(req.params.id);
    if (!test) {
      res.status(404);
      throw new Error("Test not found");
    }
    res.status(200).json({ message: "Test removed successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish a test
// @route   PATCH /api/admin/tests/:id/publish
// @access  Private (Admin)
export const publishTestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const test = await testServices.setStatus(req.params.id, "published");
    if (!test) {
      res.status(404);
      throw new Error("Test not found");
    }
    res.status(200).json(test);
  } catch (error) {
    next(error);
  }
};

// @desc    Archive a test
// @route   PATCH /api/admin/tests/:id/archive
// @access  Private (Admin)
export const archiveTestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const test = await testServices.setStatus(req.params.id, "archived");
    if (!test) {
      res.status(404);
      throw new Error("Test not found");
    }
    res.status(200).json(test);
  } catch (error) {
    next(error);
  }
};

// ─── Public Endpoints ────────────────────────────────────────────────────────

// @desc    Get all published tests — answerJson excluded
// @route   GET /api/tests?bookId=<id>
// @access  Public
export const getTests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: { bookId?: string; skill?: string } = {};
    if (req.query.bookId) filters.bookId = req.query.bookId as string;
    if (req.query.skill) filters.skill = req.query.skill as string;
    const tests = await testServices.getAll(filters);
    res.status(200).json(tests);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single published test — answerJson excluded
// @route   GET /api/tests/:id
// @access  Public
export const getTestByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const test = await testServices.getById(req.params.id);
    if (!test) {
      res.status(404);
      throw new Error("Test not found");
    }
    res.status(200).json(test);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single part/section of a published test
// @route   GET /api/tests/:id/part/:partNum
// @access  Public
export const getTestPartHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const partIndex = parseInt(req.params.partNum, 10) - 1;
    const result = await testServices.getPart(req.params.id, partIndex);
    if (!result) {
      res.status(404);
      throw new Error("Test or part not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Submit answers for a single part and get results
// @route   POST /api/tests/:id/part/:partNum/submit
// @access  Public
export const submitTestPartHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const partIndex = parseInt(req.params.partNum, 10) - 1;
    const { answers } = req.body;
    if (!answers || typeof answers !== "object") {
      res.status(400);
      throw new Error("Missing or invalid 'answers' object in request body");
    }
    const result = await testServices.submitPart(req.params.id, partIndex, answers);
    if (!result) {
      res.status(404);
      throw new Error("Test or part not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
