import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Task } from '../../../shared_components/models/Task';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../../shared_components/models/User';
import { AuthService } from '../../../shared_components/services/auth-service';
import { TaskService } from '../../../shared_components/services/task.service';
import { Subscription } from 'rxjs';
import { capitalize } from '../../../shared_components/utils/helpers/capitalize';

@Component({
  selector: 'app-dashboard-create-task-modal',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
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

  async ngOnInit() {
    this.taskSubscription = this.taskService.task$.subscribe(
      (task: Task | null) => {
        this.task = task!;
      }
    );
    this.users = await this.authService.getAllUsers();
    this.users.forEach((user) => {
      user.capitalizedRole = capitalize(user.role);
    });
    console.log(this.task)
  }

  async onSubmit(form: NgForm) {
    console.dir(form);
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
