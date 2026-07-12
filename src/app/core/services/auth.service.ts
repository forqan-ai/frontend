import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {

  AuthResponse,
  ExternalProvider,
  LoginRequest,
  RegisterRequest,
} from '../models/auth.models';
import { jwtDecode } from 'jwt-decode';

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
    const token  = this.getToken();
    if(!token){
      return false;
    }
    if(token && this.isTokenExpired(token)){
      localStorage.removeItem(this.userStorageKey);
      return false;
    }
    return true;
  }
  
  loginWithProvider(provider: ExternalProvider): void {
    const url =
      provider === 'google' ? environment.auth.googleLoginUrl : environment.auth.facebookLoginUrl;

    const returnUrl = `${window.location.origin}/auth/callback`;
    window.location.href = `${url}?returnUrl=${encodeURIComponent(returnUrl)}`;
  }

    isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<{exp:number}>(token);
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  }
}
