import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  access_token: string;
  user: { id: number; email: string; name: string };
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

  register(data: { email: string; password: string; name: string }) {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  login(data: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data).pipe(
      tap((res) => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('current_user', JSON.stringify(res.user));
        this.currentUser.set(res.user);
      }),
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
