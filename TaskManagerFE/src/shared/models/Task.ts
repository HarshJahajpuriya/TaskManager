import { TASK_STATUS } from '../utils/enums';
import { User } from './User';

export type Task = {
  _id: string;
  title: string;
  description: string;
  status: TASK_STATUS;
  assignedTo: User;
  createdAt: Date;
  updatedAt: Date;
  creator: User;
};
