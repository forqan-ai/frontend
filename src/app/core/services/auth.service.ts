import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  AuthResponse,
  ExternalProvider,
  LoginRequest,
  Payload,
  RegisterRequest,
  Role,
} from '../models/auth.models';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  public readonly userStorageKey = 'ForqanKey';

  constructor(private readonly http: HttpClient) {}

  // ---- Email / password ------------------------------------------------------
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data).pipe(
      tap((res) => {
        localStorage.setItem(this.userStorageKey, res.data.confirmationToken);
      }),
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, data).pipe(
      tap((res) => {
        console.log(res);

        localStorage.setItem(this.userStorageKey, res.data.confirmationToken);
      }),
    );
  }

  googleLogin(idToken: string | undefined) {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/google-login`, {
        idToken,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.userStorageKey, res.data.confirmationToken);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.userStorageKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.userStorageKey);
  }

  IsAuthenticated() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    if (token && this.isTokenExpired(token)) {
      localStorage.removeItem(this.userStorageKey);
      return false;
    }
    return true;
  }

  getPayload(): Payload | null {
    const token = this.getToken();

    if (!token) return null;
    const payload = jwtDecode<Payload>(token);

    return payload;
  }

  getRole(): string | null {
    return this.getPayload()?.role ?? null;
  }

  hasRole(role: Role): boolean {
    return this.getRole() === role.toString();
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  }
}
