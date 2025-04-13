import { User } from "./user";

export enum TASK_STATUS {
  PENDING = "pending",
  COMPLETED = "completed",
}

export type Task = {
  title: string;
  description: string;
  status: TASK_STATUS;
  assignedTo: User;
  createdAt: Date;
  updatedAt: Date;
  creator: User;
  _id: string;
};
