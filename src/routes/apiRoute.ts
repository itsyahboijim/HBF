//@ts-nocheck
import { Router } from "express";
import { changeBedValue, login, logout, register, registerEmail, streamHospitalUpdates, verifyEmail } from '../controller/userController';
import { authenticate } from "../middleware/checkAuthorization";

const router = Router();

// Continues /api calls
router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.post("/changeBedValue", authenticate, changeBedValue);
router.get("/streamHospitalUpdates", streamHospitalUpdates);
router.post("/registerEmail", registerEmail);
router.get("/verify", verifyEmail);

export default router;