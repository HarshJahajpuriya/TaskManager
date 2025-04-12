import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth-service';
import { ROLES } from '../../../shared/utils/enums';

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

  register() {
    this.error = '';
    console.log(this.email, this.username, this.password, this.role);

    this.authService
      .register(this.email, this.username, this.password, this.role)
      .subscribe({
        next: () => {
          confirm(
            'Registration successful! You will be redirected to the login page.'
          );
          this.router.navigate(['/login']);
        },
        error: (registerErr) => {
          console.log(registerErr.error.message);
          this.error = registerErr.error.message ?? 'Registration failed';
        },
      });
  }

  onInputChange(): void {
    this.error = '';
  }
}
