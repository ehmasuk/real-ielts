import express from "express";
import drillSchemaController from "../controllers/drill-schema.controller.js";
const router = express.Router();
router.get("/", drillSchemaController.getAllSchemasPublic);
router.get("/:drillId", drillSchemaController.getSchema);
export default router;
//# sourceMappingURL=drill-schema.routes.js.map