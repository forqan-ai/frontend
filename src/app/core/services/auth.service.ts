import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  AuthResponse,
  LoginRequest,
  Payload,
  RegisterRequest,
  Role,
} from '../models/auth.models';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/api/auth`;
  public readonly userStorageKey = 'ForqanKey';

  constructor(private readonly http: HttpClient) { }

  isLoggedIn = signal(!!localStorage.getItem('ForqanKey'));

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data).pipe(
      tap((res) => {
        localStorage.setItem(this.userStorageKey, res.data.token);
        this.isLoggedIn.set(true);
        console.log(this.getPayload());
        
      })
    );
  }



  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, data).pipe(
      tap((res) => {
        console.log(res);
        localStorage.setItem(this.userStorageKey, res.data.token);
        this.isLoggedIn.set(true);   // <-- Missing
      })
    );
  }



  googleLogin(idToken: string | undefined): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/google-login`, {
        idToken,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.userStorageKey, res.data.token);
          this.isLoggedIn.set(true);
        })
      );
  }



  logout(): void {
    localStorage.removeItem(this.userStorageKey);
    this.isLoggedIn.set(false);
  }


  getToken(): string | null {
    return localStorage.getItem(this.userStorageKey);
  }



  IsAuthenticated(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }

    return true;
  }



  getPayload(): Payload | null {
    const token = this.getToken();

    if (!token) return null;

    return jwtDecode<Payload>(token);
  }

  getRole(): string | null {
    return this.getPayload()?.role ?? null;
  }

  hasRole(role: Role): boolean {
    return this.getRole() === role;
  }



  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  }

  getUserId(){
    return this.getPayload()?.id;
  }
}