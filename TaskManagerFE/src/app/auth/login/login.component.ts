import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  usernameOrEmail: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.usernameOrEmail, this.password).subscribe({
      next: (response) => {
        console.log('Login response:', response);
      },
      error: (loginError) => {
        console.log('Login error:', loginError.error.message);
        this.error = loginError.error.message ?? 'Login failed';
      },
    });
  }

  onInputChange(): void {
    this.error = '';
  }
}
