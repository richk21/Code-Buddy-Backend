import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  assignTask,
  completeTask,
  approveTask,
  getMyTasks,
  getTasksBetweenUsers,
  deleteTaskIAssigned,
  getDashboardData,
} from "../controllers/TaskController";

const router = Router();

router.post("/assign", authMiddleware, assignTask);
router.patch("/complete/:taskId", authMiddleware, completeTask);
router.post("/approve/:taskId", authMiddleware, approveTask);
router.get("/myTasks", authMiddleware, getMyTasks);
router.get("/getDashboardData", authMiddleware, getDashboardData);
router.get("/between/:username", authMiddleware, getTasksBetweenUsers);
router.delete("/:taskId", authMiddleware, deleteTaskIAssigned);

export default router;
