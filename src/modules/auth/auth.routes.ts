import { Router } from "express"
import { loginController, registerController } from "./auth.controller"
import { authMiddleware } from "./auth.middleware"
import { logoutController, meController } from "./auth.controller"

const router = Router()

router.post("/register", registerController)
router.post("/login", loginController)
router.post("/logout", logoutController)
router.get("/me", authMiddleware, meController)

export default router