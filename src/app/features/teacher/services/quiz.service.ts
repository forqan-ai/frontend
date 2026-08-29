import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { QuizModel } from '../models/quiz.model';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/api/modules`;

  getQuiz(moduleId: string): Observable<QuizModel> {
    return this.http.get<QuizModel>(
      `${this.api}/${moduleId}/quiz`
    );
  }

  create(moduleId: string, body: any) {
    return this.http.post(
      `${this.api}/${moduleId}/quiz`,
      body
    );
  }

  update(moduleId: string, quizId: string, body: any) {
    return this.http.put(
      `${this.api}/${moduleId}/quiz/${quizId}`,
      body
    );
  }

  delete(moduleId: string, quizId: string) {
    return this.http.delete(
      `${this.api}/${moduleId}/quiz/${quizId}`
    );
  }
}