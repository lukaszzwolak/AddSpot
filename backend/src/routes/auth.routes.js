import { Router } from "express";
import { register } from "../controllers/auth.controller.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/user", authMiddleware, auth.getUser);
router.delete("/logout", authMiddleware, logout);

export default router;
