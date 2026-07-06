import bookServices from "../services/book/index.js";
// @desc    Get all published books (for public)
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res, next) => {
    try {
        const books = await bookServices.getAll();
        res.status(200).json(books);
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get all books (for admin)
// @route   GET /api/admin/books
// @access  Private (Admin)
export const getAdminBooks = async (req, res, next) => {
    try {
        const books = await bookServices.getAllAdmin();
        res.status(200).json(books);
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get a single book by ID (admin)
// @route   GET /api/admin/books/:id
// @access  Private (Admin)
export const getAdminBookById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400);
            throw new Error("Missing book id");
        }
        const book = await bookServices.getById(id);
        if (!book) {
            res.status(404);
            throw new Error("Book not found");
        }
        res.status(200).json(book);
    }
    catch (error) {
        next(error);
    }
};
// @desc    Create a new book
// @route   POST /api/admin/books
// @access  Private (Admin)
export const createBookHandler = async (req, res, next) => {
    try {
        const { number, title, slug, status } = req.body;
        const book = await bookServices.create({ number, title, slug, status });
        res.status(201).json(book);
    }
    catch (error) {
        next(error);
    }
};
// @desc    Update a book
// @route   PUT /api/admin/books/:id
// @access  Private (Admin)
export const updateBookHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400);
            throw new Error("Missing book id");
        }
        const { number, title, slug, status } = req.body;
        const book = await bookServices.update(id, { number, title, slug, status });
        if (!book) {
            res.status(404);
            throw new Error("Book not found");
        }
        res.status(200).json(book);
    }
    catch (error) {
        next(error);
    }
};
// @desc    Delete a book
// @route   DELETE /api/admin/books/:id
// @access  Private (Admin)
export const deleteBookHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400);
            throw new Error("Missing book id");
        }
        const book = await bookServices.remove(id);
        if (!book) {
            res.status(404);
            throw new Error("Book not found");
        }
        res.status(200).json({ message: "Book removed successfully" });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=book.controller.js.map