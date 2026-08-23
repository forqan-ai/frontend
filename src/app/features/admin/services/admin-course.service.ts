import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TeacherCourse } from '../../teacher/models/teacher-course.model';
import { CourseBuilderDto } from '../models/course-builder-dto.model';

@Injectable({
  providedIn: 'root',
})
export class AdminCourseService {
  private http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/api/admin/courses`;

  getPendingCourses(): Observable<TeacherCourse[]> {
    return this.http.get<TeacherCourse[]>(`${this.baseUrl}/pending`);
  }

  getPendingCourse(courseId: string): Observable<CourseBuilderDto> {
    return this.http.get<CourseBuilderDto>(`${this.baseUrl}/${courseId}`);
  }

  approveCourse(courseId: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.baseUrl}/${courseId}/approve`, {});
  }

  rejectCourse(courseId: string, reason: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.baseUrl}/${courseId}/reject`, {
      reason,
    });
  }
}
