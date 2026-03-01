import express from "express";
import cors from "cors";
import buddyRoutes from "./routes/BuddyRoutes";
import authRoutes from "./routes/AuthRoutes";
import tasksRoutes from "./routes/TaskRoutes";

const app = express();
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/buddies", buddyRoutes);
app.use("/api/tasks", tasksRoutes);

export default app;
