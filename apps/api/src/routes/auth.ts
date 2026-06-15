import { Router } from "express";
import authControllers from "../controllers/auth.js";

const router: Router = Router();

// register
router.post("/register", authControllers.registerUser);

// login
router.post("/login", authControllers.loginUser);

export default router;
