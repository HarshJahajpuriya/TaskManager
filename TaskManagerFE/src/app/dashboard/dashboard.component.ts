import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared_components/services/auth-service';
import { User } from '../../shared_components/models/User';
import { CommonModule } from '@angular/common';
import { TaskModalComponent } from './taskModal/taskModal.component';
import { TaskService } from '../../shared_components/services/task.service';
import { Task } from '../../shared_components/models/Task';
import { formatDateTime } from '../../shared_components/utils/helpers/dateTimeFormatter';
import { capitalize } from '../../shared_components/utils/helpers/capitalize';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TaskModalComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  user!: User | null;
  tasks: Task[] = [];
  isTaskModalOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) {
    this.user = this.authService.getLogggedInUser();
    this.taskService.allTasks$.subscribe((tasks) => {
      tasks.forEach((task) => {
        task.createdAtString = formatDateTime(task.createdAt as Date);
        task.updatedAtString = formatDateTime(task.updatedAt as Date);
        task.id = task._id;
        task.capitalizedStatus = capitalize(task.status);
      });
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
      const isTaskDeleted = await this.taskService.deleteTask(task.id);
      if (isTaskDeleted) {
        this.tasks = this.tasks.filter((t) => t.id !== task.id);
      }
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
