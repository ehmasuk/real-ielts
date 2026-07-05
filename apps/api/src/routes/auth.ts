import { Router } from "express"
import authControllers from "../controllers/auth.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { validate } from "../middlewares/validate.js"
import { authSyncSchema } from "../validations/index.js"

const router: Router = Router()

router.post("/sync", validate(authSyncSchema), authControllers.sync)
router.get("/me", isAuthenticated, authControllers.me)

export default router
