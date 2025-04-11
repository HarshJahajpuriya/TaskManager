import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    // make API call to login
    // this.user = response.user;
    sessionStorage.setItem('userToken', 'response.JWT');
    return username === 'admin' && password === 'password';
  }

  logout(): void {
    this.userSubject.next(null);
    sessionStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    if (sessionStorage.getItem('userToken')) {
      return true;
    }
    this.userSubject.next(null);
    this.router.navigate(['/login']);
    return false;
  }

  register(email: string, username: string, password: string): boolean {
    // make API call to register the user
    return false;
  }

  getLogggedInUser() {
    if (this.userSubject.value) {
      return this.userSubject.value;
    } else this.router.navigate(['/login']);
    return null;
  }

  getAllUsers() {
    // make API call to fetch all the users
    return [];
  }
}
