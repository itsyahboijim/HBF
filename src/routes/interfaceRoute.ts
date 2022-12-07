//@ts-nocheck
import { Router } from "express";
import { hospitalFeed, login, account } from "../controller/pageController";

const router = Router();

// Continues /interface calls
router.get("/hospitalFeed", hospitalFeed);
router.get("/login", login);
router.get("/account", account);

export default router;