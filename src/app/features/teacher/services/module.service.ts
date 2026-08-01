import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ModuleModel } from '../models/module.model';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private http = inject(HttpClient);

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

  delete(courseId: string, moduleId: string) {
    return this.http.delete(
      `${this.api}/${courseId}/modules/${moduleId}`
    );
  }
}