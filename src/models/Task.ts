import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  points: number;
  assignedBy: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  status: "pending" | "completed" | "pending_approval";
  createdAt: Date;
  completedAt?: Date;
  proof?: string;
  hoursSpent?: number;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    points: { type: Number, default: 1 },
    assignedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "pending_approval"],
      default: "pending",
    },
    proof: { type: String },
    completedAt: { type: Date },
    hoursSpent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ITask>("Task", TaskSchema);
