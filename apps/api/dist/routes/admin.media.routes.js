import express from "express";
import { getAllMedia, createMedia, updateMedia, deleteMedia } from "../controllers/media.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import requireRole from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import { createMediaSchema, updateMediaSchema } from "../validations/index.js";
const router = express.Router();
router.use(isAuthenticated, requireRole("admin"));
router.get("/", getAllMedia);
router.post("/", validate(createMediaSchema), createMedia);
router.patch("/:id", validate(updateMediaSchema), updateMedia);
router.delete("/:id", deleteMedia);
export default router;
//# sourceMappingURL=admin.media.routes.js.map