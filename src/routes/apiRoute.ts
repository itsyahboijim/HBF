//@ts-nocheck
import { Router } from "express";
import { login, logout, register } from '../controller/userController';

const router = Router();

// Continues /api calls
router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);

export default router;