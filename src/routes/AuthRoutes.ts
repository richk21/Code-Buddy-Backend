import { Router } from "express";
import {
  createUser,
  getLoggedInUser,
  getUserByUsername,
  login,
} from "../controllers/AuthController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/register", createUser);
router.post("/login", login);
router.get("/loggedInUser", getLoggedInUser);
router.get("/users/:username", authMiddleware, getUserByUsername);

export default router;
