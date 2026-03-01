import { Router } from "express";
import {
  connectBuddy,
  getBuddiesList,
  matchUsers,
} from "../controllers/BuddyController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/match", authMiddleware, matchUsers);
router.get("/buddiesList", authMiddleware, getBuddiesList);
router.post("/connect", authMiddleware, connectBuddy);

export default router;
