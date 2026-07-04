import express from "express"
import { createBugReport } from "../controllers/bug-report.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"

const router = express.Router()

router.post("/", isAuthenticated, createBugReport)

export default router
