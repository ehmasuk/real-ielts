import express from "express"
import drillSchemaController from "../controllers/drill-schema.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import requireRole from "../middlewares/requireRole.js"

const router: express.Router = express.Router()

router.use(isAuthenticated, requireRole("admin"))

router.get("/", drillSchemaController.getAllSchemas)
router.get("/:drillId", drillSchemaController.getSchemaAdmin)
router.put("/:drillId", drillSchemaController.updateSchema)

export default router
