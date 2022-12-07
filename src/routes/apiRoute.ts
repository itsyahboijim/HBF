//@ts-nocheck
import { Router } from "express";
import { login } from '../controller/userController';

const router = Router();

// Continues /api calls
router.post("/login", login);

export default router;