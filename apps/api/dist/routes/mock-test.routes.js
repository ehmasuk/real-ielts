import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { startSession, getSession, getModuleContent, submitModule, } from "../controllers/mock-test.controller.js";
const router = express.Router();
router.use(isAuthenticated); // All mock test routes require auth
router.post("/start", startSession);
router.get("/session/:sessionId", getSession);
router.get("/:sessionId/module/:skill", getModuleContent);
router.post("/:sessionId/module/:skill/submit", submitModule);
export default router;
//# sourceMappingURL=mock-test.routes.js.map