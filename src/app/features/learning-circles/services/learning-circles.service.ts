import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateLearningCircleRequest,
  LearningCircleDetails,
  LearningCircleListItem,
  UpdateLearningCircleRequest,
} from '../models/learning-circle.models';
import {
  PagedResult,
  SearchPaginationQuery,
} from '../models/pagination.models';

@Injectable({ providedIn: 'root' })
export class LearningCirclesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl =
    `${environment.apiUrl}/api/learning-circles`;

  getAll(
    query: SearchPaginationQuery,
  ): Observable<PagedResult<LearningCircleListItem>> {
    return this.http.get<PagedResult<LearningCircleListItem>>(
      this.baseUrl,
      { params: this.createSearchParams(query) },
    );
  }

  getMine(
    query: SearchPaginationQuery,
  ): Observable<PagedResult<LearningCircleListItem>> {
    return this.http.get<PagedResult<LearningCircleListItem>>(
      `${this.baseUrl}/mine`,
      { params: this.createSearchParams(query) },
    );
  }

  getDetails(circleId: string): Observable<LearningCircleDetails> {
    return this.http.get<LearningCircleDetails>(
      `${this.baseUrl}/${circleId}`,
    );
  }

  create(
    request: CreateLearningCircleRequest,
  ): Observable<LearningCircleDetails> {
    return this.http.post<LearningCircleDetails>(
      this.baseUrl,
      request,
    );
  }

  update(
    circleId: string,
    request: UpdateLearningCircleRequest,
  ): Observable<LearningCircleDetails> {
    return this.http.put<LearningCircleDetails>(
      `${this.baseUrl}/${circleId}`,
      request,
    );
  }

  archive(circleId: string): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.baseUrl}/${circleId}`,
    );
  }

  join(circleId: string): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.baseUrl}/${circleId}/join`,
      {},
    );
  }

  leave(circleId: string): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.baseUrl}/${circleId}/leave`,
    );
  }

  private createSearchParams(
    query: SearchPaginationQuery,
  ): HttpParams {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber.toString())
      .set('pageSize', query.pageSize.toString());

    const search = query.search?.trim();

    if (search) {
      params = params.set('search', search);
    }

    return params;
  }
}
