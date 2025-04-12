import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { User } from '../../../shared/models/User';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {
  title: string = 'Task Manager';
  currentUrl: string = '';
  isLoggedIn: boolean = false;
  user!: User | null;

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  logout() {
    this.isLoggedIn = false;
    this.authService.logout();
  }
}
