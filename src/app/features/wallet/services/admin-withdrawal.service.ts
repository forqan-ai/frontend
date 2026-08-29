import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AdminWithdrawalDetails,
  AdminWithdrawalListItem,
  PaginatedResponse,
  toWithdrawalStatus,
  WithdrawalStatus,
} from '../wallet.models';

@Injectable({
  providedIn: 'root',
})
export class AdminWithdrawalService {
  private http = inject(HttpClient);

  private baseUrl = `${environment.apiUrl}/api/admin/withdrawals`;

  getWithdrawals(
    status: WithdrawalStatus | null,
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Observable<PaginatedResponse<AdminWithdrawalListItem>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (status !== null && status !== undefined) {
      params = params.set('status', status);
    }

    return this.http
      .get<PaginatedResponse<AdminWithdrawalListItem>>(this.baseUrl, { params })
      .pipe(
        map((res) => ({
          ...res,
          items: res.items.map((item) => ({ ...item, status: toWithdrawalStatus(item.status) })),
        })),
      );
  }

  getWithdrawalDetails(id: string): Observable<AdminWithdrawalDetails> {
    return this.http
      .get<AdminWithdrawalDetails>(`${this.baseUrl}/${id}`)
      .pipe(map((w) => ({ ...w, status: toWithdrawalStatus(w.status) })));
  }

  approve(id: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/${id}/approve`, {});
  }

  reject(id: string, reason: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/${id}/reject`, { reason });
  }

  completeTransfer(id: string, transferReference?: string | null): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/${id}/complete-transfer`, {
      transferReference: transferReference ?? null,
    });
  }
}
