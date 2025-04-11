import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Task } from '../../../shared_components/models/Task';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../../shared_components/models/User';
import { AuthService } from '../../../shared_components/services/auth-service';
import { TaskService } from '../../../shared_components/services/task.service';
import { Subscription } from 'rxjs';

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

  constructor(private authService: AuthService, private taskService: TaskService) {
    this.users = this.authService.getAllUsers();
  }

  ngOnInit() {
    this.taskSubscription = this.taskService.task$.subscribe((task: Task | null) => {
      this.task=task!;
    })
  }

  onSubmit(form: NgForm) {
    console.log('Submitted')
  }

  closeTaskModal() {
    this.closeModal.emit(false);
  }
}
