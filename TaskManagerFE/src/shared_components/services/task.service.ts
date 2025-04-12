import { Injectable } from '@angular/core';
import { Task } from '../models/Task';
import { BehaviorSubject, take } from 'rxjs';
import { TaskListResponse } from '../utils/response';
import { All_TASK_API_URL, BASE_API_URL } from './urls';
import { decodeToken } from '../utils/helpers/decodeToken';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskSubject = new BehaviorSubject<Task | null>(null);
  task$ = this.taskSubject.asObservable();
  private allTasksSubject = new BehaviorSubject<Task[]>([]);
  allTasks$ = this.allTasksSubject.asObservable();

  constructor() {}

  createTask(task: Task): Promise<Task> {
    return new Promise<Task>(async (resolve, reject) => {
      const token = sessionStorage.getItem('userToken');
      const userId = decodeToken(token!)._id;
      try {
        const response = await fetch(`${BASE_API_URL}${All_TASK_API_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
          },
          body: JSON.stringify({ ...task, creator: userId }),
        });
        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(`${errorBody.message}`);
        }
        const createdTask = await response.json();
        console.log(createdTask);
        this.allTasksSubject.next([createdTask, ...this.allTasksSubject.value]);
        resolve(createdTask);
      } catch (error: any) {
        console.error('Error deleting task:', error.message);
        reject(new Error(error.message as string));
      }
    });
  }

  updateTask(task: Task): Promise<Task[]> {
    return new Promise<Task[]>(async (resolve, reject) => {
      console.log(task.assignedTo);
      try {
        const response = await fetch(
          `${BASE_API_URL}${All_TASK_API_URL}/${task._id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
            },
            body: JSON.stringify(task),
          }
        );
        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(`${errorBody.message}`);
        }
        const updatedTask = await response.json();
        const updatedTasks = this.allTasksSubject.value.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
        this.allTasksSubject.next(updatedTasks);
        resolve(updatedTasks);
      } catch (error: any) {
        console.error('Error deleting task:', error.message);
        reject(new Error(error.message as string));
      }
    });
  }

  deleteTask(taskId: string): Promise<Boolean> {
    return new Promise<Boolean>(async (resolve, reject) => {
      try {
        const response = await fetch(
          `${BASE_API_URL}${All_TASK_API_URL}/${taskId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
            },
          }
        );
        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(`${errorBody.message}`);
        }

        resolve(true);
      } catch (error: any) {
        console.error('Error deleting task:', error.message);
        reject(new Error(error.message as string));
      }
    });
  }

  getTasks(): Promise<TaskListResponse> {
    return new Promise<TaskListResponse>(async (resolve, reject) => {
      try {
        const response = await fetch(`${BASE_API_URL}${All_TASK_API_URL}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
          },
        });
        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(`${errorBody.message}`);
        }
        const tasks = await response.json();
        this.allTasksSubject.next(tasks);
        resolve({
          isSuccess: true,
          tasks,
          message: 'Tasks fetched successfully',
        });
      } catch (error: any) {
        console.error('Fetch failed:', error.message);
        reject(new Error(error.message as string));
      }
    });
  }

  setTask(task: Task | null) {
    console.log(task);
    this.taskSubject.next(task);
  }

  getTask(): Task | null {
    return this.taskSubject.value;
  }
}
