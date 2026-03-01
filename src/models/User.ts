import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  avatar: string;
  skillLevel: string;
  focusArea: string;
  weeklyGoal: string;
  streak: number;
  points: number;
  buddies: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  skillLevel: { type: String, required: true },
  focusArea: { type: String, required: true },
  weeklyGoal: { type: String, required: true },
  streak: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  buddies: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model<IUser>("User", UserSchema);
