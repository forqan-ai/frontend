import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  ApiResponse,
  AuthResponse,
  AuthUser,
  ExternalProvider,
  LoginRequest,
  RegisterRequest,
} from '../models/auth.models';

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
        localStorage.setItem(this.userStorageKey, res.token);
      }),
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, data).pipe(
      tap((res) => {
        localStorage.setItem(this.userStorageKey, res.token);
      }),
    );
  }

  googleLogin(idToken: string | undefined) {
    return this.http
      .post<ApiResponse<any>>(`${this.baseUrl}/google-login`, {
        idToken,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.userStorageKey, res.data.token);
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
    return this.getToken() ? true : false;
  }
  loginWithProvider(provider: ExternalProvider): void {
    const url =
      provider === 'google' ? environment.auth.googleLoginUrl : environment.auth.facebookLoginUrl;

    const returnUrl = `${window.location.origin}/auth/callback`;
    window.location.href = `${url}?returnUrl=${encodeURIComponent(returnUrl)}`;
  }
}
