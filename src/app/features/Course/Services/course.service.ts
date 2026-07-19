import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ICourseDetailsDto } from '../Models/course-details-dto.interface';
import { ICourseModuleDto } from '../Models/course-module-dto.interface';
import { environment } from '../../../../environments/environment.development';
import { ICourseOwnership } from '../Models/course-ownership.interface';
import { ICoursePlayer } from '../Models/course-player.interface';

@Injectable({
    providedIn: 'root'
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
   
getCoursePlayer(courseId:string): Observable<ICoursePlayer> {

  return this.http.get<ICoursePlayer>(
    `${this.baseUrl}/${courseId}/player`
  );

}
}
