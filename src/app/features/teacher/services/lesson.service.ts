import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { LessonModel } from '../models/lesson.model';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/api/modules`;

  getLessons(moduleId: string): Observable<LessonModel[]> {
    return this.http.get<LessonModel[]>(`${this.api}/${moduleId}/lessons`);
  }
  getLesson(moduleId: string, lessonId: string) {
    return this.http.get<any>(`${this.api}/${moduleId}/lessons/${lessonId}`).pipe(
      map((lesson) => ({
        ...lesson,
        contentType: lesson.contentType === 'Video' ? 0 : lesson.contentType === 'Audio' ? 1 : 2,
      })),
    );
  }
  create(moduleId: string, body: any) {
    return this.http.post(`${this.api}/${moduleId}/lessons`, body);
  }

  update(moduleId: string, lessonId: string, body: any) {
    return this.http.put(`${this.api}/${moduleId}/lessons/${lessonId}`, body);
  }

  delete(moduleId: string, lessonId: string) {
    return this.http.delete(`${this.api}/${moduleId}/lessons/${lessonId}`);
  }

  uploadVideo(moduleId: string, lessonId: string, file: File) {
    const formData = new FormData();

    formData.append('file', file);

    return this.http
      .post<any>(`${this.api}/${moduleId}/lessons/${lessonId}/video`, formData)
      .pipe(map((res) => res.data));
  }

  uploadPdf(moduleId: string, lessonId: string, file: File) {
    const formData = new FormData();

    formData.append('file', file);

    return this.http
      .post<any>(`${this.api}/${moduleId}/lessons/${lessonId}/pdf`, formData)
      .pipe(map((res) => res.data));
  }

  uploadAudio(moduleId: string, lessonId: string, file: File) {
    const formData = new FormData();

    formData.append('file', file);

    return this.http
      .post<any>(`${this.api}/${moduleId}/lessons/${lessonId}/audio`, formData)
      .pipe(map((res) => res.data));
  }
}
