import { Task } from '../models/Task';
import { User } from '../models/User';

export type UserResponse = {
  isSuccess: boolean;
  user: User | null;
  message: string | null;
};

export type TaskResponse = {
  isSuccess: boolean;
  task: Task | null;
  message: string | null;
}

export type TaskListResponse = {
  isSuccess: boolean;
  tasks: Task[] | null;
  message: string | null;
};
