import express from "express";
import { getAdminBooks, getAdminBookById, createBookHandler, updateBookHandler, deleteBookHandler, } from "../controllers/book.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import requireRole from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import { createBookSchema, updateBookSchema } from "../validations/index.js";
const router = express.Router();
router.use(isAuthenticated, requireRole("admin"));
router.get("/", getAdminBooks);
router.get("/:id", getAdminBookById);
router.post("/", validate(createBookSchema), createBookHandler);
router.put("/:id", validate(updateBookSchema), updateBookHandler);
router.delete("/:id", deleteBookHandler);
export default router;
//# sourceMappingURL=admin.book.routes.js.map