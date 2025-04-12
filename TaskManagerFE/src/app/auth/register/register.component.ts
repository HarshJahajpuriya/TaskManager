import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared_components/services/auth-service';
import { ROLES } from '../../../shared_components/utils/enums';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  title = 'Registration Page';
  email: string = '';
  username: string = '';
  password: string = '';
  role!: ROLES;
  error: string = '';

  USER_ROLES = [
    [ROLES.EMPLOYEE, 'Employee'],
    [ROLES.MANAGER, 'Manager'],
    [ROLES.TEAM_LEAD, 'Team Lead'],
  ];

  constructor(private authService: AuthService, private router: Router) {}

  async register(): Promise<void> {
    this.error = '';
    console.log(this.email, this.username, this.password, this.role);
    if (
      await this.authService.register(
        this.email,
        this.username,
        this.password,
        this.role
      )
    ) {
      confirm(
        'Registration successful! You will be redirected to the login page.'
      );
      this.router.navigate(['/login']);
    } else {
      this.error = 'Invalid username or password';
    }
  }

  onInputChange(): void {
    this.error = '';
  }
}
