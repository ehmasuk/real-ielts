import testServices from "../services/test/index.js";
// ─── Admin Endpoints ────────────────────────────────────────────────────────
// @desc    Get all tests (admin) — filterable by bookId
// @route   GET /api/admin/tests?bookId=<id>
// @access  Private (Admin)
export const getAdminTests = async (req, res, next) => {
    try {
        const tests = await testServices.getAllAdmin(req.query.bookId);
        res.status(200).json(tests);
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get a single test by ID (admin) — includes answerJson
// @route   GET /api/admin/tests/:id
// @access  Private (Admin)
export const getAdminTestByIdHandler = async (req, res, next) => {
    try {
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
    }
    catch (error) {
        next(error);
    }
};
// @desc    Create a new test
// @route   POST /api/admin/tests
// @access  Private (Admin)
export const createTestHandler = async (req, res, next) => {
    try {
        const { bookId, testNumber, skill, status, contentJson, answerJson } = req.body;
        const test = await testServices.create({ bookId, testNumber, skill, status, contentJson, answerJson });
        res.status(201).json(test);
    }
    catch (error) {
        next(error);
    }
};
// @desc    Update a test
// @route   PUT /api/admin/tests/:id
// @access  Private (Admin)
export const updateTestHandler = async (req, res, next) => {
    try {
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
    }
    catch (error) {
        next(error);
    }
};
// @desc    Delete a test
// @route   DELETE /api/admin/tests/:id
// @access  Private (Admin)
export const deleteTestHandler = async (req, res, next) => {
    try {
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
    }
    catch (error) {
        next(error);
    }
};
// @desc    Publish a test
// @route   PATCH /api/admin/tests/:id/publish
// @access  Private (Admin)
export const publishTestHandler = async (req, res, next) => {
    try {
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
    }
    catch (error) {
        next(error);
    }
};
// @desc    Archive a test
// @route   PATCH /api/admin/tests/:id/archive
// @access  Private (Admin)
export const archiveTestHandler = async (req, res, next) => {
    try {
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
    }
    catch (error) {
        next(error);
    }
};
// ─── Public Endpoints ────────────────────────────────────────────────────────
// @desc    Get all published tests — answerJson excluded
// @route   GET /api/tests?bookId=<id>
// @access  Public
export const getTests = async (req, res, next) => {
    try {
        const filters = {};
        if (req.query.bookId)
            filters.bookId = req.query.bookId;
        if (req.query.skill)
            filters.skill = req.query.skill;
        const tests = await testServices.getAll(filters);
        res.status(200).json(tests);
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get a single published test — answerJson excluded
// @route   GET /api/tests/:id
// @access  Public
export const getTestByIdHandler = async (req, res, next) => {
    try {
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
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get a single part/section of a published test
// @route   GET /api/tests/:id/part/:partNum
// @access  Public
export const getTestPartHandler = async (req, res, next) => {
    try {
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
    }
    catch (error) {
        next(error);
    }
};
// @desc    Submit answers for a single part and get results
// @route   POST /api/tests/:id/part/:partNum/submit
// @access  Authenticated
export const submitTestPartHandler = async (req, res, next) => {
    try {
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
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get all results for the current user
// @route   GET /api/tests/user-results
// @access  Authenticated
export const getUserResultsHandler = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            res.status(401);
            throw new Error("Please login first");
        }
        const results = await testServices.getUserResults(req.user.id);
        res.status(200).json(results);
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get saved result for a test part
// @route   GET /api/tests/:id/part/:partNum/result
// @access  Authenticated
export const getPartResultHandler = async (req, res, next) => {
    try {
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
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=test.controller.js.map