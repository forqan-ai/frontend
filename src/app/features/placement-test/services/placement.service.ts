import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PlacementQuestion,
  PlacementResult,
  SubmitPlacementDto,
} from '../models/placement.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlacementService {
  private readonly baseUrl = `${environment.apiUrl}/api/placement`;

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<PlacementQuestion[]> {
    return this.http.get<PlacementQuestion[]>(`${this.baseUrl}/questions`);
  }

  hasTakenTest(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/has-taken`);
  }

  submitTest(dto: SubmitPlacementDto): Observable<PlacementResult> {
    return this.http.post<PlacementResult>(`${this.baseUrl}/submit`, dto);
  }

  getMyResult(): Observable<PlacementResult> {
    return this.http.get<PlacementResult>(`${this.baseUrl}/my-result`);
  }
}
