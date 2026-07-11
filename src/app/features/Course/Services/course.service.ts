import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ICourseDetailsDto } from '../Models/course-details-dto.interface';
import { ICourseModuleDto } from '../Models/course-module-dto.interface';

@Injectable({
    providedIn: 'root'
})

export class CourseService {

    http = inject(HttpClient);

    private baseUrl = 'https://localhost:7054/api/courses';

    getCourseDetails(courseId: string): Observable<ICourseDetailsDto> {
        return this.http.get<ICourseDetailsDto>(`${this.baseUrl}/${courseId}`);
    }

    getCourseCurriculum(courseId: string): Observable<ICourseModuleDto[]> {
        return this.http.get<ICourseModuleDto[]>(`${this.baseUrl}/${courseId}/curriculum`);
    }
}
