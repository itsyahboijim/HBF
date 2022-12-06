//@ts-nocheck
import { Router } from "express";
import { hospitalFeed, login, account } from "../controller/pageController";

const router = Router();

router.get("/hospitalFeed", hospitalFeed);
router.get("/login", login);
router.get("/account", account);

export default router;