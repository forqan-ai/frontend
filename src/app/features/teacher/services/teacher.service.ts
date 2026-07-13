import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Teacher } from '../models/teacher.model';
import { environment } from '../../../../environments/environment';
import { ITeacherDetailsDto } from '../models/teacher-details-dto.interface';

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

  getTeacherDetails(id: string): Observable<ITeacherDetailsDto> {
    return this.http.get<ITeacherDetailsDto>(`${this.api}/${id}/details`);
  }
}