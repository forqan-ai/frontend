import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { TeacherProfile } from '../models/teacher-profile.model';
import { TeacherDashboard } from '../models/teacher-dashboard.model';
import { ITeacherDetailsDto } from '../models/teacher-details-dto.interface';
import { UpdateTeacherProfile } from '../models/update-teacher-profile.model';
import { Specialty } from '../models/specialty.model';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/api/teachers`;

  constructor() {
    console.log(this.api);
  }
  getProfile(): Observable<TeacherProfile> {
    return this.http.get<TeacherProfile>(`${this.api}/me`);
  }

  getDashboard(): Observable<TeacherDashboard> {
    return this.http.get<TeacherDashboard>(`${this.api}/dashboard`);
  }

  getTeacherDetails(id: string): Observable<ITeacherDetailsDto> {
    return this.http.get<ITeacherDetailsDto>(`${this.api}/${id}/details`);
  }

  updateProfile(data: FormData) {
    return this.http.put(`${this.api}/me`, data);
  }


  getAllSpecialties() {
  return this.http.get<Specialty[]>(
    `${environment.apiUrl}/api/specialties`
  );
}

updateTeacherSpecialties(ids: string[]) {
  return this.http.put(
    `${this.api}/me/specialties`,
    {
      specialtyIds: ids
    }
  );
}
}
