import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateWithdrawalRequest,
  PaginatedResponse,
  toWithdrawalStatus,
  WalletSummary,
  WalletTransaction,
  Withdrawal,
} from '../wallet.models';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/api/wallet`;

  getSummary(): Observable<WalletSummary> {
    return this.http.get<WalletSummary>(`${this.api}/summary`);
  }

  getTransactions(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResponse<WalletTransaction>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<PaginatedResponse<WalletTransaction>>(`${this.api}/transactions`, { params });
  }

  getWithdrawals(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Withdrawal>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http
      .get<PaginatedResponse<Withdrawal>>(`${this.api}/withdrawals`, { params })
      .pipe(
        map((res) => ({
          ...res,
          items: res.items.map((item) => ({ ...item, status: toWithdrawalStatus(item.status) })),
        })),
      );
  }

  createWithdrawal(dto: CreateWithdrawalRequest, idempotencyKey: string): Observable<Withdrawal> {
    const headers = new HttpHeaders({ 'Idempotency-Key': idempotencyKey });

    return this.http
      .post<Withdrawal>(`${this.api}/withdrawals`, dto, { headers })
      .pipe(map((w) => ({ ...w, status: toWithdrawalStatus(w.status) })));
  }

  cancelWithdrawal(id: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.api}/withdrawals/${id}/cancel`, {});
  }
}
