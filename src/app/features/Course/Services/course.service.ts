import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ICourseDetailsDto } from '../Models/course-details-dto.interface';
import { ICourseModuleDto } from '../Models/course-module-dto.interface';
import { environment } from '../../../../environments/environment.development';
import { ICourseOwnership } from '../Models/course-ownership.interface';
import { ICoursePlayer } from '../Models/course-player.interface';
import { ICourseListItem } from '../../courses-browse/models/course-list-item.interface';
import { ICertificate } from '../Models/certificate.interface';
import { TeacherCourse } from '../../teacher/models/teacher-course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  http = inject(HttpClient);

  private baseUrl = `${environment.apiUrl}/api/courses`;

  getCourseDetails(courseId: string): Observable<ICourseDetailsDto> {
    return this.http.get<ICourseDetailsDto>(`${this.baseUrl}/${courseId}`);
  }

  getCourseCurriculum(courseId: string): Observable<ICourseModuleDto[]> {
    return this.http.get<ICourseModuleDto[]>(`${this.baseUrl}/${courseId}/curriculum`);
  }
  
  checkOwnership(courseId: string): Observable<ICourseOwnership> {
    return this.http.get<ICourseOwnership>(`${this.baseUrl}/${courseId}/ownership`);
  }

  getRecommendedCourses(): Observable<ICourseListItem[]> {
    return this.http.get<ICourseListItem[]>(`${this.baseUrl}/recommended`);
  }

  getCoursePlayer(courseId: string): Observable<ICoursePlayer> {
    return this.http.get<ICoursePlayer>(`${this.baseUrl}/${courseId}/player`);
  }
  createCourse(data: FormData): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }
  getMyCourses() {
  return this.http.get<TeacherCourse[]>(
    `${this.baseUrl}/me`
  );
}
  markLessonCompleted(lessonId: string): Observable<boolean> {
  return this.http.post<boolean>(
    `${this.baseUrl}/lessons/${lessonId}/complete`,
    {}
  );
}
getCertificate(courseId: string): Observable<ICertificate> {
  return this.http.get<ICertificate>(
    `${this.baseUrl}/${courseId}/certificate`
  );
}

submitCourseForReview(courseId: string): Observable<boolean> {
  return this.http.patch<boolean>(
    `${this.baseUrl}/${courseId}/submit-review`,
    {}
  );
}

}
