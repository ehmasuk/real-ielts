import { Router } from "express"
import authControllers from "../controllers/auth.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"

const router: Router = Router()

router.post("/sync", authControllers.sync)
router.get("/me", isAuthenticated, authControllers.me)

export default router
