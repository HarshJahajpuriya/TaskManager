import { Injectable } from '@angular/core';
import { Task } from '../models/Task';
import { BehaviorSubject } from 'rxjs';
import { ROLES } from '../utils/enums';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskSubject = new BehaviorSubject<Task | null>(null);
  task$ = this.taskSubject.asObservable();

  constructor() {}

  createTask(task: Task): Task {
    // make API call to create the task
    return task;
  }

  updateTask(task: Task): Task {
    // make API call to update the task
    return task;
  }

  deleteTask(taskId: string): void {
    // make API call to delete the task
  }

  getTasks(userRole: ROLES): Task[] {
    if (userRole === ROLES.MANAGER) {
      // Fetch all tasks from the API
    } else if (userRole === ROLES.TEAM_LEAD) {
      // Fetch the tasks assigned to the employee and himself
    } else {
      // Fetch the tasks assigned to the employee only
    }
    return [];
  }

  setTask(task: Task | null) {
    console.log(task)
    this.taskSubject.next(task);
  }

  getTask(): Task | null {
    return this.taskSubject.value;
  }
}
