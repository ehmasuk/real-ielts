import express from "express";
import { getBooks, getBookCount } from "../controllers/book.controller.js";
const router = express.Router();
router.get("/", getBooks);
router.get("/count", getBookCount);
export default router;
//# sourceMappingURL=book.routes.js.map