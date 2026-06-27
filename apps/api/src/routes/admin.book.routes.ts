import express from "express";
import {
  getAdminBooks,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
} from "../controllers/book.controller.js";

const router = express.Router();

router.get("/", getAdminBooks);
router.post("/", createBookHandler);
router.put("/:id", updateBookHandler);
router.delete("/:id", deleteBookHandler);

export default router;
