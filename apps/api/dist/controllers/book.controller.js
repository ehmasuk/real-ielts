import bookServices from "../services/book/index.js";
import catchAsync from "../utils/catchAsync.js";
// @desc    Get all published books (for public)
// @route   GET /api/books
// @access  Public
export const getBooks = catchAsync(async (req, res) => {
    const { category } = req.query;
    const books = await bookServices.getAll(category ? { category: String(category) } : undefined);
    res.status(200).json(books);
});
// @desc    Get book count
// @route   GET /api/books/count
// @access  Public
export const getBookCount = catchAsync(async (req, res) => {
    const { category } = req.query;
    const count = await bookServices.count(category ? { category: String(category) } : undefined);
    res.status(200).json({ count });
});
// @desc    Get all books (for admin)
// @route   GET /api/admin/books
// @access  Private (Admin)
export const getAdminBooks = catchAsync(async (req, res) => {
    const { category } = req.query;
    const books = await bookServices.getAllAdmin(category ? { category: String(category) } : undefined);
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
    const { number, title, slug, status, category } = req.body;
    const book = await bookServices.create({ number, title, slug, status, category });
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
    // Only include fields the client actually sent — passing undefined keys
    // would make Mongoose apply the model setter (defaulting category to "cambridge")
    const updates = {};
    if (req.body.number !== undefined)
        updates.number = req.body.number;
    if (req.body.title !== undefined)
        updates.title = req.body.title;
    if (req.body.slug !== undefined)
        updates.slug = req.body.slug;
    if (req.body.status !== undefined)
        updates.status = req.body.status;
    if (req.body.category !== undefined)
        updates.category = req.body.category;
    const book = await bookServices.update(id, updates);
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