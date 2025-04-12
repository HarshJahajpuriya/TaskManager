import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/User';
import { CommonModule } from '@angular/common';
import { TaskModalComponent } from './taskModal/taskModal.component';
import { TaskService } from '../../shared/services/task.service';
import { Task } from '../../shared/models/Task';
import { SocketService } from '../../shared/services/socket.service';
import { take } from 'rxjs';
import { ROLES } from '../../shared/utils/enums';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TaskModalComponent, FormsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  user: User | null;
  tasks: Task[] = [];
  isTaskModalOpen: boolean = false;
  statusFilter: 'completed' | 'pending' | 'all' = 'all';

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
        if (this.user?.role === ROLES.EMPLOYEE) {
          if (task.assignedTo._id !== this.user._id) {
            this.taskService.setAllTasks(
              tasks.filter((tmpTask) => tmpTask._id !== task._id)
            );
            return;
          }
        } else if (this.user?.role === ROLES.TEAM_LEAD) {
          if (task.assignedTo.role === ROLES.MANAGER) {
            this.taskService.setAllTasks(
              tasks.filter((tmpTask) => tmpTask._id !== task._id)
            );
            return;
          }
        }
        const taskIndex = tasks.findIndex(
          (tmpTask) => tmpTask._id === task._id
        );
        if (taskIndex === -1) {
          tasks.unshift(task);
        } else {
          tasks.splice(taskIndex, 1, task);
        }
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
        this.taskService.setAllTasks(
          tasks.filter((tmpTask) => tmpTask._id !== taskId)
        );
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

  filterTasks() {
    if (this.statusFilter === 'all') {
      this.tasks = this.taskService.getAllTasks();
      return;
    }
    this.tasks = this.taskService
      .getAllTasks()
      .filter((task) => task.status === this.statusFilter);
  }
}
