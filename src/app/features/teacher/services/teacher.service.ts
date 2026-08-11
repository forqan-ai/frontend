import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TeacherProfile } from '../models/teacher-profile.model';
import { TeacherDashboard } from '../models/teacher-dashboard.model';
import { ITeacherDetailsDto } from '../models/teacher-details-dto.interface';
import { Specialty } from '../models/specialty.model';
import { IPaginatedResult } from '../../courses-browse/models/paginated-result.interface';
import { ITeacherListItem, ITeacherListQuery } from '../models/teacher-list.model';

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

  getTeachers(query: ITeacherListQuery): Observable<IPaginatedResult<ITeacherListItem>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.search) {
      params = params.set('search', query.search);
    }

    return this.http.get<IPaginatedResult<ITeacherListItem>>(this.api, { params });
  }

  getTeacherDetails(id: string): Observable<ITeacherDetailsDto> {
    return this.http.get<ITeacherDetailsDto>(`${environment.apiUrl}/api/teachers/${id}/details`);
  }

  updateProfile(data: FormData) {
    return this.http.put(`${this.api}/me`, data);
  }

  getAllSpecialties() {
    return this.http.get<Specialty[]>(`${environment.apiUrl}/api/specialties`);
  }

  updateTeacherSpecialties(ids: string[]) {
    return this.http.put(`${this.api}/me/specialties`, {
      specialtyIds: ids,
    });
  }
}
