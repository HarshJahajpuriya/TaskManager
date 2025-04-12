import { Injectable } from '@angular/core';
import { Task } from '../models/Task';
import { BehaviorSubject, take } from 'rxjs';
import { All_TASK_API_URL } from './urls';
import { decodeToken } from '../utils/helpers/decodeToken';
import { HttpApiService } from './http-api.service';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskSubject = new BehaviorSubject<Task | null>(null);
  task$ = this.taskSubject.asObservable();
  private allTasksSubject = new BehaviorSubject<Task[]>([]);
  allTasks$ = this.allTasksSubject.asObservable();

  constructor(
    private httpApiService: HttpApiService,
    private authService: AuthService
  ) {}

  createTask(task: Task) {
    const token = sessionStorage.getItem('userToken');
    const userId = decodeToken(token!)._id;
    this.httpApiService
      .post<{ creator: string }, Task>(`${All_TASK_API_URL}`, {
        ...task,
        creator: userId,
      })
      .subscribe({
        next: (response) => {
          this.allTasks$.pipe(take(1)).subscribe((tasks) => {
            this.allTasksSubject.next([response, ...tasks]);
          });
        },
        error: (error) => {
          console.log(error);
          // forbidden
          if (error.status === 403) {
            this.authService.logout();
          }
        },
      });
  }

  updateTask(task: Task) {
    this.httpApiService
      .patch<Task, Task>(`${All_TASK_API_URL}/${task._id}`, task)
      .subscribe({
        next: (response) => {
          this.allTasks$.pipe(take(1)).subscribe((tasks) => {
            tasks.splice(
              tasks.findIndex((tmpTask) => tmpTask._id === task._id),
              1,
              response
            );
            this.allTasksSubject.next(tasks);
          });
        },
        error: (error) => {
          console.log(error);
          // forbidden
          if (error.status === 403) {
            this.authService.logout();
          }
        },
      });
  }

  deleteTask(taskId: string) {
    this.httpApiService
      .delete<Task>(`${All_TASK_API_URL}/${taskId}`)
      .subscribe({
        next: (response) => {
          this.allTasks$.pipe(take(1)).subscribe((tasks) => {
            const updatedTasks = tasks.filter((task) => task._id !== taskId);
            this.allTasksSubject.next(updatedTasks);
          });
        },
        error: (error) => {
          console.log(error);
          // forbidden
          if (error.status === 403) {
            this.authService.logout();
          }
        },
      });
  }

  getTasks() {
    this.httpApiService.get<Task[]>(`${All_TASK_API_URL}`).subscribe({
      next: (response) => {
        this.allTasks$.pipe(take(1)).subscribe((tasks) => {
          this.allTasksSubject.next(response);
        });
      },
      error: (error) => {
        console.log(error);
        // forbidden
        if (error.status === 403) {
          this.authService.logout();
        }
      },
    });
  }

  setTask(task: Task | null) {
    this.taskSubject.next(task);
  }

  getTask(): Task | null {
    return this.taskSubject.value;
  }
}
