import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  All_USER_API_URL,
  BASE_API_URL,
  LOGIN_API_URL,
  REGISTER_API_URL,
} from './urls';
import { UserResponse } from '../utils/response';
import { decodeToken } from '../utils/helpers/decodeToken';
import { ROLES } from '../utils/enums';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private router: Router) {
    const token = sessionStorage.getItem('userToken');
    if (token) {
      const user = decodeToken(token);
      this.userSubject.next(user);
    } else {
      this.userSubject.next(null);
    }
  }

  async login(username: string, password: string): Promise<UserResponse> {
    return new Promise<UserResponse>(async (resolve, reject) => {
      try {
        const response = await fetch(`${BASE_API_URL}${LOGIN_API_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(`${errorBody.message}`);
        }
        const { token, user } = await response.json();
        console.log(token, user);
        this.userSubject.next(user);
        sessionStorage.setItem('userToken', token);
        resolve({ isSuccess: true, user, message: 'Login successful' });
      } catch (error: any) {
        console.error('Login failed:', error.message);
        reject(new Error(error.message as string));
      }
    });
  }

  logout(): void {
    this.userSubject.next(null);
    sessionStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }

  register(
    email: string,
    username: string,
    password: string,
    role: ROLES
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const response = await fetch(`${BASE_API_URL}${REGISTER_API_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ role, email, username, password }),
        });
        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(`${errorBody.message}`);
        }
        const { token, user } = await response.json();
        console.log(token, user);
        this.userSubject.next(user);
        sessionStorage.setItem('userToken', token);
        resolve(true);
      } catch (error: any) {
        console.error('Registration failed:', error.message);
        reject(new Error(error.message as string));
      }
    });
  }

  getLogggedInUser() {
    if (this.userSubject.value && sessionStorage.getItem('userToken')) {
      return this.userSubject.value;
    } else this.router.navigate(['/login']);
    return null;
  }

  getAllUsers(): Promise<User[]> {
    return new Promise<User[]>(async (resolve, reject) => {
      try {
        const response = await fetch(`${BASE_API_URL}${All_USER_API_URL}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
          },
        });
        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(`${errorBody.message}`);
        }
        const users = await response.json();
        resolve(users);
      } catch (error: any) {
        console.error('Fetch failed:', error.message);
        reject(new Error(error.message as string));
      }
    });
  }
}
