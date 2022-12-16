//@ts-nocheck
import { Router } from "express";
import { hospitalFeed, login, account, adminValidate } from "../controller/pageController";
import { authenticate } from "../middleware/checkAuthorization";

const router = Router();

// Continues /interface calls
router.get("/hospitalFeed", hospitalFeed);
router.get("/login", login);
router.get("/account", authenticate, account);

// For demonstration purposes
router.get("/adminValidate", adminValidate);

export default router;