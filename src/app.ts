import express from "express";
import cors from "cors";
import buddyRoutes from "./routes/BuddyRoutes";
import authRoutes from "./routes/AuthRoutes";
import tasksRoutes from "./routes/TaskRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/buddies", buddyRoutes);
app.use("/api/tasks", tasksRoutes);

export default app;
