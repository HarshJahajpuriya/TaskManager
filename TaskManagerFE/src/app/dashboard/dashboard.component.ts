import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/User';
import { CommonModule } from '@angular/common';
import { TaskModalComponent } from './taskModal/taskModal.component';
import { TaskService } from '../../shared/services/task.service';
import { Task } from '../../shared/models/Task';
import { SocketService } from '../../shared/services/socket.service';
import { take } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TaskModalComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  user: User | null;
  tasks: Task[] = [];
  isTaskModalOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private socketService: SocketService
  ) {
    this.user = this.authService.getLogggedInUser();
    this.taskService.allTasks$.subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  ngOnInit() {
    this.taskService.getTasks();
    this.socketService.on('update-task').subscribe((task: Task) => {
      this.taskService.allTasks$.pipe(take(1)).subscribe((tasks) => {
        tasks.splice(
          tasks.findIndex((tmpTask) => tmpTask._id === task._id),
          1,
          task
        );
        this.taskService.setAllTasks(tasks);
      });
    });

    this.socketService.on('add-task').subscribe((task: Task) => {
      this.taskService.allTasks$.pipe(take(1)).subscribe((tasks) => {
        tasks.unshift(task);
        this.taskService.setAllTasks(tasks);
      });
    });

    this.socketService.on('remove-task').subscribe((taskId: string) => {
      this.taskService.allTasks$.pipe(take(1)).subscribe((tasks) => {
        this.taskService.setAllTasks( tasks.filter((tmpTask) => tmpTask._id !== taskId));
      });
    });
  }

  openNewTaskModal() {
    this.taskService.setTask(null);
    this.isTaskModalOpen = true;
  }

  openEditTaskModal(taskToUpdate: Task) {
    this.taskService.setTask(taskToUpdate);
    this.isTaskModalOpen = true;
  }

  async deleteTask(task: Task, ev: Event) {
    ev.stopPropagation();
    try {
      await this.taskService.deleteTask(task._id);
    } catch (error: any) {
      alert(error.message);
    }
  }

  closeTaskModal() {
    this.isTaskModalOpen = false;
  }

  cloneTask(task: Task): Task {
    return JSON.parse(JSON.stringify(task));
  }
}
