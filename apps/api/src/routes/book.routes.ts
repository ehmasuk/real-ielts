import express from "express";
import { getBooks, getAdminBooks } from "../controllers/book.controller.js";

const router: express.Router = express.Router();

router.get("/", getBooks);

export default router;
