import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../shared/models/Task';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../../shared/models/User';
import { AuthService } from '../../../shared/services/auth-service';
import { TaskService } from '../../../shared/services/task.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-create-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './taskModal.component.html',
})
export class TaskModalComponent implements OnInit {
  task!: Task;
  users!: User[] | null;
  private taskSubscription!: Subscription;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.taskSubscription = this.taskService.task$.subscribe(
      (task: Task | null) => {
        this.task = task!;
      }
    );
    this.authService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
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

  async onSubmit(form: NgForm) {
    console.dir(form.value);
    if (this.taskService.getTask()) {
      try {
        await this.taskService.updateTask(this.task);
        this.closeModal.emit(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        this.taskService.createTask(form.value);
        this.closeModal.emit(false);
      } catch (error) {
        console.log(error);
      }
    }
  }

  closeTaskModal() {
    this.closeModal.emit(false);
  }
}
