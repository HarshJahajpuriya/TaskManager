import { Injectable } from '@angular/core';
import { Task } from '../models/Task';
import { BehaviorSubject, take } from 'rxjs';
import { All_TASK_API_URL } from './urls';
import { decodeToken } from '../utils/decodeToken';
import { HttpApiService } from './http-api.service';
import { AuthService } from './auth.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly taskSubject = new BehaviorSubject<Task | null>(null);
  task$ = this.taskSubject.asObservable();
  private readonly allTasksSubject = new BehaviorSubject<Task[]>([]);
  allTasks$ = this.allTasksSubject.asObservable();

  constructor(
    private readonly httpApiService: HttpApiService,
    private readonly authService: AuthService,
    private readonly socketService: SocketService
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
          this.socketService.emit('task-got-added', response);
        },
        error: (error) => {
          console.log(error);
          // forbidden
          if (error.status === 403) {
            alert('Token expired!!! Redirecting to Login Page.');
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
            this.socketService.emit('task-got-updated', response);
          });
        },
        error: (error) => {
          console.log(error);
          // forbidden
          if (error.status === 403) {
            alert('Token expired!!! Redirecting to Login Page.');
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
            this.socketService.emit('task-got-deleted', taskId);
          });
        },
        error: (error) => {
          console.log(error);
          // forbidden
          if (error.status === 403) {
            alert('Token expired!!! Redirecting to Login Page.');
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
          alert('Token expired!!! Redirecting to Login Page.');
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

  getAllTasks() {
    return this.allTasksSubject.value;
  }

  setAllTasks(tasks: Task[]) {
    this.allTasksSubject.next(tasks);
  }
}
