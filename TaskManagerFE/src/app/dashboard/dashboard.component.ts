import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth-service';
import { User } from '../../shared/models/User';
import { CommonModule } from '@angular/common';
import { TaskModalComponent } from './taskModal/taskModal.component';
import { TaskService } from '../../shared/services/task.service';
import { Task } from '../../shared/models/Task';
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
    private taskService: TaskService
  ) {
    this.user = this.authService.getLogggedInUser();
    this.taskService.allTasks$.subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  async ngOnInit() {
    await this.taskService.getTasks();
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
