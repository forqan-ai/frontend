import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeacherProfile } from '../models/teacher-profile.model';
import { environment } from '../../../../environments/environment';
import { TeacherDashboard } from '../models/teacher-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private http = inject(HttpClient);

  getProfile(): Observable<TeacherProfile> {

    return this.http.get<TeacherProfile>(
      `${environment.apiUrl}/teachers/me`
    );

  }
  getDashboard() {

  return this.http.get<TeacherDashboard>(
    `${environment.apiUrl}/teachers/dashboard`
  );

}
}