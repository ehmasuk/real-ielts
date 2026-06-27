import type { Request, Response, NextFunction } from "express";
import bookServices from "../services/book/index.js";

// @desc    Get all published books (for public)
// @route   GET /api/books
// @access  Public
export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookServices.getAll();
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all books (for admin)
// @route   GET /api/admin/books
// @access  Private (Admin)
export const getAdminBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookServices.getAllAdmin();
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new book
// @route   POST /api/admin/books
// @access  Private (Admin)
export const createBookHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { number, title, slug, status } = req.body;
    const book = await bookServices.create({ number, title, slug, status });
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a book
// @route   PUT /api/admin/books/:id
// @access  Private (Admin)
export const updateBookHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { number, title, slug, status } = req.body;
    const book = await bookServices.update(req.params.id, { number, title, slug, status });
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a book
// @route   DELETE /api/admin/books/:id
// @access  Private (Admin)
export const deleteBookHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await bookServices.remove(req.params.id);
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }
    res.status(200).json({ message: "Book removed successfully" });
  } catch (error) {
    next(error);
  }
};
