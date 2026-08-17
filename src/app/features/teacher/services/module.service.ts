import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, map, catchError } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { ModuleModel } from '../models/module.model';

import { QuizService } from './quiz.service';
import { QuestionService } from './question.service';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private http = inject(HttpClient);
  private quizService = inject(QuizService);
  private questionService = inject(QuestionService);

  private api = `${environment.apiUrl}/api/courses`;

  getModules(courseId: string): Observable<ModuleModel[]> {
    return this.http.get<ModuleModel[]>(
      `${this.api}/${courseId}/modules`
    );
  }

  create(courseId: string, body: any) {
    return this.http.post(
      `${this.api}/${courseId}/modules`,
      body
    );
  }

  update(courseId: string, moduleId: string, body: any) {
    return this.http.put(
      `${this.api}/${courseId}/modules/${moduleId}`,
      body
    );
  }

  delete(courseId: string, moduleId: string): Observable<any> {
    return this.quizService.getQuiz(moduleId).pipe(
      switchMap((quiz: any) => {
        // مفيش Quiz للموديول
        if (!quiz) {
          return this.deleteModule(courseId, moduleId);
        }

        const quizId = quiz.quizID ?? quiz.QuizID;

        if (!quizId) {
          return this.deleteModule(courseId, moduleId);
        }

        // هات كل الأسئلة
        return this.questionService.getQuestions(quizId).pipe(
          switchMap((questions) => {
            // امسح كل الأسئلة الأول
            if (!questions || questions.length === 0) {
              return of(null);
            }

            return this.deleteQuestions(questions);
          }),
          // بعد حذف الأسئلة امسح الـ Quiz
          switchMap(() => {
            return this.quizService.delete(moduleId, quizId);
          }),
          // بعد حذف الـ Quiz امسح الـ Module
          switchMap(() => {
            return this.deleteModule(courseId, moduleId);
          })
        );
      }),

      /*
       * لو GET Quiz رجع 404 لأن الـ Module
       * مفيهوش Quiz، احذف الـ Module مباشرة.
       */
      catchError((error) => {
        if (error.status === 404) {
          return this.deleteModule(courseId, moduleId);
        }

        throw error;
      })
    );
  }

  private deleteQuestions(questions: any[]): Observable<any> {
    if (questions.length === 0) {
      return of(null);
    }

    return this.questionService.delete(
      questions[0].questionID ?? questions[0].QuestionID
    ).pipe(
      switchMap(() => {
        return this.deleteQuestions(questions.slice(1));
      })
    );
  }

  private deleteModule(courseId: string, moduleId: string): Observable<any> {
    return this.http.delete(
      `${this.api}/${courseId}/modules/${moduleId}`
    );
  }
}