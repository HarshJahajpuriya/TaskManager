import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared_components/services/auth-service';
import { UserResponse } from '../../../shared_components/utils/response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  usernameOrEmail: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login(): Promise<void> {
    try {
      const loginResponse: UserResponse = await this.authService.login(
        this.usernameOrEmail,
        this.password
      );
      if (loginResponse.isSuccess) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error = loginResponse.message ?? 'Login failed';
      }
    } catch (error: any) {
      console.log('Login error:', error);
      this.error = (error as UserResponse).message ?? 'Login failed';
    }
  }

  onInputChange(): void {
    this.error = '';
  }
}
