import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Teacher } from '../models/teacher.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/teachers`;

  getProfile(): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.api}/me`);
  }

  updateProfile(data: { bio: string }) {
    return this.http.put(`${this.api}/me`, data);
  }
}