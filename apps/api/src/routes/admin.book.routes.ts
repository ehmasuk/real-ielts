import express from "express";
import {
  getAdminBooks,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
} from "../controllers/book.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import requireRole from "../middlewares/requireRole.js";

const router = express.Router();

router.use(isAuthenticated, requireRole("admin"));

router.get("/", getAdminBooks);
router.post("/", createBookHandler);
router.put("/:id", updateBookHandler);
router.delete("/:id", deleteBookHandler);

export default router;
