import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { throwError } from 'rxjs';

interface AuthResponse {
  access_token: string;
  user: { id: number; email: string; name: string };
}

export interface AuthError {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  currentUser = signal<AuthResponse['user'] | null>(null);

  constructor() {
    const stored = localStorage.getItem('current_user');
    if (stored) this.currentUser.set(JSON.parse(stored));
  }

  private mapAuthError(err: HttpErrorResponse) {
    let message: string;

    if (err.status === 0) {
      message = 'Cannot reach the server. Please try again.';
    } else if (err.status >= 500) {
      message = 'Something went wrong. Please try again.';
    } else {
      const backendMessage = err.error?.message;
      message = Array.isArray(backendMessage) ? backendMessage.join(', ') : backendMessage;
    }

    return throwError(() => ({ message }));
  }

  register(data: { email: string; password: string; name: string }) {
    return this.http
      .post(`${this.apiUrl}/auth/register`, data)
      .pipe(catchError((err: HttpErrorResponse) => this.mapAuthError(err)));
  }

  login(data: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data).pipe(
      tap((res) => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('current_user', JSON.stringify(res.user));
        this.currentUser.set(res.user);
      }),
      catchError((err: HttpErrorResponse) => this.mapAuthError(err)),
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
