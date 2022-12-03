//@ts-nocheck
import { Router } from "express";
import { testHospitalFeed, testLogin } from "../controller/pageController";

const router = Router();

router.get('/hospitalFeed', testHospitalFeed);
router.get('/account', testLogin);

export default router;