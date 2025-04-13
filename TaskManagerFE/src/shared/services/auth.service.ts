import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { All_USER_API_URL, LOGIN_API_URL, REGISTER_API_URL } from './urls';
import { decodeToken } from '../utils/decodeToken';
import { ROLES } from '../utils/enums';
import { HttpApiService } from './http-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private readonly router: Router,
    private readonly httpApiService: HttpApiService
  ) {
    const token = sessionStorage.getItem('userToken');
    if (token) {
      const user = decodeToken(token);
      this.userSubject.next(user);
    } else {
      this.userSubject.next(null);
    }
  }

  login(
    username: string,
    password: string
  ): Observable<{ token: string; user: User }> {
    return this.httpApiService
      .post<
        { username: string; password: string },
        { token: string; user: User }
      >(`${LOGIN_API_URL}`, { username, password })
      .pipe(
        tap((response) => {
          sessionStorage.setItem('userToken', response.token);
          this.userSubject.next(response.user);
          this.router.navigate(['/dashboard']);
        })
      );
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
  ): Observable<User> {
    return this.httpApiService.post<
      { email: string; username: string; password: string; role: ROLES },
      User
    >(`${REGISTER_API_URL}`, { email, username, password, role });
  }

  getLogggedInUser() {
    if (this.userSubject.value && sessionStorage.getItem('userToken')) {
      return this.userSubject.value;
    } else this.router.navigate(['/login']);
    return null;
  }

  getAllUsers(): Observable<User[]> {
    return this.httpApiService.get<User[]>(`${All_USER_API_URL}`);
  }
}
