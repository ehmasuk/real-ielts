import bookServices from "../services/book/index.js";
import catchAsync from "../utils/catchAsync.js";
// @desc    Get all published books (for public)
// @route   GET /api/books
// @access  Public
export const getBooks = catchAsync(async (req, res) => {
    const books = await bookServices.getAll();
    res.status(200).json(books);
});
// @desc    Get all books (for admin)
// @route   GET /api/admin/books
// @access  Private (Admin)
export const getAdminBooks = catchAsync(async (req, res) => {
    const books = await bookServices.getAllAdmin();
    res.status(200).json(books);
});
// @desc    Get a single book by ID (admin)
// @route   GET /api/admin/books/:id
// @access  Private (Admin)
export const getAdminBookById = catchAsync(async (req, res) => {
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
});
// @desc    Create a new book
// @route   POST /api/admin/books
// @access  Private (Admin)
export const createBookHandler = catchAsync(async (req, res) => {
    const { number, title, slug, status } = req.body;
    const book = await bookServices.create({ number, title, slug, status });
    res.status(201).json(book);
});
// @desc    Update a book
// @route   PUT /api/admin/books/:id
// @access  Private (Admin)
export const updateBookHandler = catchAsync(async (req, res) => {
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
});
// @desc    Delete a book
// @route   DELETE /api/admin/books/:id
// @access  Private (Admin)
export const deleteBookHandler = catchAsync(async (req, res) => {
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
});
//# sourceMappingURL=book.controller.js.map