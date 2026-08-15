import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IUserSettings, ChangePasswordRequest } from '../Models/settings.interface';

import { environment } from '../../../../environments/environment.development';

interface UserResponse {
  succeeded: boolean;
  data: IUserSettings;
  errors: any;
}

interface ProfileChangeRequestResponse {
  succeded: boolean;
  data: any;
  errorMessage?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl + '/api/users/me';

  user = signal<IUserSettings | null>(null);

  // =========================
  // Get Current User
  // =========================

  getSettings(): Observable<IUserSettings> {
    return this.http.get<UserResponse>(this.apiUrl).pipe(map((res) => res.data));
  }

  // =========================
  // User Signal
  // =========================

  setUser(user: IUserSettings) {
    this.user.set(user);
  }

  updateUser(data: Partial<IUserSettings>) {
    const current = this.user();

    if (current) {
      this.user.set({
        ...current,
        ...data,
      });
    }
  }

  // =========================
  // Profile Change Request
  // =========================

  createProfileChangeRequest(
    fullName: string,
    profileImage: File | null,
  ): Observable<ProfileChangeRequestResponse> {
    const formData = new FormData();

    if (fullName.trim()) {
      formData.append('newFullName', fullName.trim());
    }

    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    return this.http.post<ProfileChangeRequestResponse>(
      `${this.apiUrl}/profile-change-request`,
      formData,
    );
  }

  // =========================
  // Get My Pending Request
  // =========================

  getMyPendingProfileChangeRequest(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile-change-request`);
  }

  // =========================
  // Change Password
  // =========================

  changePassword(data: ChangePasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/password`, data);
  }
}
