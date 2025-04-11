import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../shared_components/services/auth-service';
import { User } from '../../shared_components/models/User';
import { CommonModule } from '@angular/common';
import { TaskModalComponent } from './taskModal/taskModal.component';
import { TaskService } from '../../shared_components/services/task.service';
import { Task } from '../../shared_components/models/Task';
import { formatDateTime } from '../../shared_components/utils/dateTimeFormatter';
import { ROLES } from '../../shared_components/utils/enums';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TaskModalComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  user!: User | null;
  tasks: any[] = [];
  isTaskModalOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) {
    // this.user = this.authService.getLogggedInUser();
    this.tasks = this.taskService.getTasks(this.user?.role as ROLES);
  }

  ngOnInit() {
    this.tasks.push({
      id: 101,
      title: 'Task 1',
      description: 'This is the first task',
      status: 'completed',
      createdAt: formatDateTime(new Date()),
      updatedAt: formatDateTime(new Date()),
      creator: 'John Doe',
      assignedTo: 'Jane Smith',
    });
    this.tasks.push({
      id: 110,
      title: 'Task 11',
      description: 'This is the last task',
      status: 'pending',
      createdAt: formatDateTime(new Date()),
      updatedAt: formatDateTime(new Date()),
      creator: 'John Dick',
      assignedTo: 'Jane Whore',
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

  saveTask($event: Event) {
    // will have to save the task via making an API call
  }

  deleteTask(task: Task, ev: Event) {
    alert('deleting');
    ev.stopPropagation();
    this.taskService.deleteTask(task.id);
  }

  closeTaskModal() {
    this.isTaskModalOpen = false;
  }
}
