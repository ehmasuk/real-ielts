import express from "express";
import adminUsersController from "../controllers/admin.users.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import requireRole from "../middlewares/requireRole.js";
const router = express.Router();
router.use(isAuthenticated, requireRole("admin"));
router.get("/", adminUsersController.list);
router.patch("/:id", adminUsersController.update);
export default router;
//# sourceMappingURL=admin.users.routes.js.map