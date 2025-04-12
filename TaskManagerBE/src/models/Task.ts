import mongoose, { Schema, Document } from "mongoose";
import { TASK_STATUS } from "../utils/enums";

export interface Task extends Document {
  title: string;
  description: string;
  status: TASK_STATUS;
  assignedTo: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  creator: mongoose.Schema.Types.ObjectId;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: TASK_STATUS, default: TASK_STATUS.PENDING },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model<Task>("Task", TaskSchema);
