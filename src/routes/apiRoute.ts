//@ts-nocheck
import { Router } from "express";
import { changeBedValue, editProfile, editProfilePicture, login, logout, register, registerEmail, streamHospitalUpdates, verifyEmail } from '../controller/userController';
import { authenticate } from "../middleware/checkAuthorization";
import multer from "multer";

const router = Router();

const fs = require("fs");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(`${__dirname}/../../public/images/hospitals`, {recursive: true});
        cb(null, `${__dirname}/../../public/images/hospitals`);
    },
    filename: (req, file, cb) => {
        const fileExtension = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${Date.now()}.${fileExtension}`);
    },
});
const upload = multer({storage});

// Continues /api calls
router.post("/login", login);
router.post("/register", upload.single("image"), register);
router.post("/logout", logout);
router.post("/changeBedValue", authenticate, changeBedValue);
router.get("/streamHospitalUpdates", streamHospitalUpdates);
router.post("/registerEmail", registerEmail);
router.patch("/verify/:idToken", verifyEmail);
router.post("/editProfile", authenticate, editProfile);
router.post("/editProfilePicture", authenticate, upload.single("image"), editProfilePicture);

export default router;