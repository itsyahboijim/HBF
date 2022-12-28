//@ts-nocheck
import { Router } from "express";
import { changeBedValue, login, logout, register, registerEmail, streamHospitalUpdates, verifyEmail } from '../controller/userController';
import { authenticate } from "../middleware/checkAuthorization";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/../../public/images`);
    },
    filename: (req, file, cb) => {
        const fileExtension = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${Date.now()}.${fileExtension}`);
    },
});
const upload = multer({storage});

const registerBody = multer

// Continues /api calls
router.post("/login", login);
router.post("/register", upload.single("image"), register);
router.get("/logout", logout);
router.post("/changeBedValue", authenticate, changeBedValue);
router.get("/streamHospitalUpdates", streamHospitalUpdates);
router.post("/registerEmail", registerEmail);
router.get("/verify", verifyEmail);

export default router;