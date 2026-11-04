import express from "express"
import adminUsersController from "../controllers/admin.users.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import requireRole from "../middlewares/requireRole.js"
import validateObjectId from "../middlewares/validateObjectId.js"
import { validate } from "../middlewares/validate.js"
import { updateUserSchema } from "../validations/index.js"

const router: express.Router = express.Router()

router.use(isAuthenticated, requireRole("admin"))
router.param("id", validateObjectId("id"))

router.get("/", adminUsersController.list)
router.patch("/:id", validate(updateUserSchema), adminUsersController.update)

export default router
