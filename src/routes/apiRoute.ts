//@ts-nocheck
import { Router } from "express";
import { login, register } from '../controller/userController';

const router = Router();

// Continues /api calls
router.post("/login", login);
router.post("/register", register);

export default router;