import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CircleJoinRequestStatus } from '../models/learning-circle.models';
import { CircleJoinRequest, ReviewCircleJoinRequest } from '../models/circle-join-request.models';
import { PagedResult } from '../models/pagination.models';

@Injectable({ providedIn: 'root' })
export class CircleJoinRequestsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/learning-circles`;

  create(circleId: string, message?: string): Observable<CircleJoinRequest> {
    return this.http.post<CircleJoinRequest>(`${this.baseUrl}/${circleId}/join-requests`, {
      message: message?.trim() || null,
    });
  }

  cancel(circleId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${circleId}/join-requests/mine`);
  }

  getAll(circleId: string, status: CircleJoinRequestStatus | null, pageNumber: number, pageSize: number): Observable<PagedResult<CircleJoinRequest>> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (status) params = params.set('status', status);
    return this.http.get<PagedResult<CircleJoinRequest>>(`${this.baseUrl}/${circleId}/join-requests`, { params });
  }

  approve(circleId: string, requestId: string, note?: string): Observable<boolean> {
    return this.review(circleId, requestId, 'approve', { reviewNote: note?.trim() || null });
  }

  reject(circleId: string, requestId: string, note?: string): Observable<boolean> {
    return this.review(circleId, requestId, 'reject', { reviewNote: note?.trim() || null });
  }

  private review(circleId: string, requestId: string, action: 'approve' | 'reject', body: ReviewCircleJoinRequest): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/${circleId}/join-requests/${requestId}/${action}`, body);
  }
}
