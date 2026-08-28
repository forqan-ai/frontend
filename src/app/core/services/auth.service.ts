import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  AuthResponse,
  LoginRequest,
  Payload,
  RegisterRequest,
  RegisterResponse,
  Role,
} from '../models/auth.models';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

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
        localStorage.setItem('userId', res.data.user.id)
        localStorage.setItem('userImg', res.data.user.profileImageURL!);
        localStorage.setItem('fullName', res.data.user.fullName!);
        this.isLoggedIn.set(true);
        console.log(this.getPayload());

      })
    );
  }



  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, data).pipe(
      tap((res) => {
        console.log(res);
        localStorage.setItem(this.userStorageKey, res.data.confirmationToken);
        localStorage.setItem('userId', res.data.userId);
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
          localStorage.setItem('userId', res.data.user.id)
          localStorage.setItem('userImg', res.data.user.profileImageURL!)
          localStorage.setItem('fullName', res.data.user.fullName!);
          this.isLoggedIn.set(true);
        })
      );
  }

  route = inject(Router);
  logout(): void {
    localStorage.removeItem(this.userStorageKey);
    localStorage.removeItem('userId');
    localStorage.removeItem('userImg');
    localStorage.removeItem('fullName');
    this.isLoggedIn.set(false);
    this.route.navigateByUrl('/login')
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

  getRole(): Role | null {
    const payload: any = this.getPayload();
    if (!payload) return null;
    return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role || null;
  }


  getUserId(): string | null {
    const payload: any = this.getPayload();
    if (!payload) return null;
    return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.id || null;
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

  // getUserId(){
  //   return this.getPayload()?.id;
  // }
}