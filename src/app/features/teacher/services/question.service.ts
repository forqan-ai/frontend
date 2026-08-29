import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { QuestionModel } from '../models/question.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/api`;

  getQuestions(quizId: string): Observable<QuestionModel[]> {
    return this.http
      .get<any>(`${this.api}/quizzes/${quizId}/questions`)
      .pipe(map((res) => res.data as QuestionModel[]));
  }

  getQuestion(questionId: string): Observable<QuestionModel> {
    return this.http.get<any>(`${this.api}/questions/${questionId}`).pipe(map((res) => res.data));
  }

  create(quizId: string, body: any) {
    return this.http.post(`${this.api}/quizzes/${quizId}/questions`, body);
  }

  update(questionId: string, body: any) {
    return this.http.put(`${this.api}/questions/${questionId}`, body);
  }

  delete(questionId: string) {
    return this.http.delete(`${this.api}/questions/${questionId}`);
  }
}
