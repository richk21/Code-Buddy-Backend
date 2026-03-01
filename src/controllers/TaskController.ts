import { Request, Response } from "express";
import Task from "../models/Task";
import User from "../models/User";
import mongoose from "mongoose";

export const assignTask = async (req: Request, res: Response) => {
  try {
    const assignedBy = req.user!.id;
    const { title, description, points, assignedToUsername } = req.body;

    const assignedTo = await User.findOne({ username: assignedToUsername });
    if (!assignedTo)
      return res.status(404).json({ message: "Buddy not found" });

    if (
      !assignedTo.buddies.some((buddyId) => buddyId.toString() === assignedBy)
    )
      return res
        .status(400)
        .json({ message: "Can only assign tasks to connected buddies" });

    const task = await Task.create({
      title,
      description,
      points,
      assignedBy: new mongoose.Types.ObjectId(assignedBy),
      assignedTo: assignedTo._id,
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Task assignment failed" });
  }
};

export const completeTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.user!.id;
    const { proof, hoursSpent } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.assignedTo.toString() !== userId)
      return res.status(403).json({ message: "Not your task" });

    task.status = "pending_approval";
    task.proof = proof;
    task.hoursSpent = hoursSpent;
    task.completedAt = new Date();
    await task.save();

    res.json({ message: "Task completed, waiting for approval", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error completing task" });
  }
};

export const approveTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.user!.id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.assignedBy.toString() !== userId)
      return res.status(403).json({ message: "Not your assigned task" });

    task.status = "completed";
    await task.save();

    const assignee = await User.findById(task.assignedTo);
    if (assignee) {
      assignee.points += task.points;
      await assignee.save();
    }

    res.json({ message: "Task completed and points added", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error approving task" });
  }
};

export const getMyTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const tasks = await Task.find({
      $or: [
        { assignedTo: userId },
        { $and: [{ assignedBy: userId }, { status: "pending_approval" }] },
      ],
    }).populate("assignedBy", "username");
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const tasks = await Task.find({ assignedTo: userId, status: "completed" });
    const points = tasks.reduce((sum, task) => sum + task.points, 0);
    const tasksCompleted = tasks.length;

    const tasksAssigned = await Task.countDocuments({
      assignedBy: userId,
      status: { $in: ["pending_approval", "completed", "pending"] },
    });

    const tasksPendingApproval = await Task.countDocuments({
      assignedBy: userId,
      status: "pending_approval",
    });

    const user = await User.findById(userId).select("weeklyGoal").lean();

    const goalHours = user?.weeklyGoal || 0;

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const tasksForHoursGoal = await Task.find({
      assignedTo: userId,
      status: "completed",
      completedAt: {
        $gte: startOfWeek,
        $lte: endOfWeek,
      },
    });

    const hoursSpent = tasksForHoursGoal.reduce(
      (sum, task) => sum + (task.hoursSpent || 0),
      0,
    );

    res.json({
      points,
      tasksCompleted,
      tasksAssigned,
      tasksPendingApproval,
      hoursSpent,
      goalHours,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

export const deleteTaskIAssigned = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const taskId = req.params.taskId;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.assignedBy.toString() !== userId)
      return res.status(403).json({ message: "Not your assigned task" });

    await task.deleteOne();

    res.json(true);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting task" });
  }
};

export const getTasksBetweenUsers = async (req: any, res: Response) => {
  try {
    const myId = req.user.id;
    const { username } = req.params;

    const buddy = await User.findOne({ username });

    if (!buddy) {
      return res.status(404).json({ message: "User not found" });
    }

    const me = await User.findById(myId);

    if (!me?.buddies.includes(buddy._id)) {
      return res.status(403).json({ message: "Not connected" });
    }

    const tasks = await Task.find({
      $or: [
        { assignedBy: myId, assignedTo: buddy._id },
        { assignedBy: buddy._id, assignedTo: myId },
      ],
    })
      .populate("assignedBy", "username")
      .populate("assignedTo", "username");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};
