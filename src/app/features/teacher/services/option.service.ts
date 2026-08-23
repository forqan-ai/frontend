import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { OptionModel } from '../models/option.model';

@Injectable({
  providedIn: 'root',
})
export class OptionService {
  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/api`;

  getOptions(questionId: string): Observable<OptionModel[]> {
    return this.http
      .get<any>(`${this.api}/questions/${questionId}/options`)
      .pipe(map((res) => res.data));
  }

  getOption(optionId: string): Observable<OptionModel> {
    return this.http.get<any>(`${this.api}/options/${optionId}`).pipe(map((res) => res.data));
  }

  create(questionId: string, body: any) {
    return this.http.post(`${this.api}/questions/${questionId}/options`, body);
  }

  update(optionId: string, body: any) {
    return this.http.put(`${this.api}/options/${optionId}`, body);
  }

  delete(optionId: string) {
    return this.http.delete(`${this.api}/options/${optionId}`);
  }
}
