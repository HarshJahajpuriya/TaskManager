import { ROLES, TASK_STATUS } from "./enums";

export type User = {
  username: string;
  email: string;
  password: string;
  role: ROLES;
  _id: string;
};

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
