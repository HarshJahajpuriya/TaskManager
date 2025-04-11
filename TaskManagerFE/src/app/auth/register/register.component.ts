import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared_components/services/auth-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  title = 'Registration Page';
  email: string = '';
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.error = '';
    if (this.authService.register(this.email, this.username, this.password)) {
      this.router.navigate(['/login']);
    } else {
      this.error = 'Invalid username or password';
    }
  }

  onInputChange(): void {
    this.error = '';
  }
}
