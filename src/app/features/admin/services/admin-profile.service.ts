import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment.development';

import {
  ProfileChangeRequest,
  ReviewProfileChangeRequest,
} from '../models/profile-change-request.model';

@Injectable({
  providedIn: 'root',
})
export class AdminProfileService {
  private http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/api/admin/profile-change-requests`;

  getPendingRequests(): Observable<ProfileChangeRequest[]> {
    return this.http.get<ProfileChangeRequest[]>(this.baseUrl);
  }

  getRequestById(requestId: string): Observable<ProfileChangeRequest> {
    return this.http.get<ProfileChangeRequest>(`${this.baseUrl}/${requestId}`);
  }

  reviewRequest(requestId: string, request: ReviewProfileChangeRequest): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/${requestId}/review`, request);
  }
}
