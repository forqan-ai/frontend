import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/APIResponse';
import { environment } from '../../../environments/environment.development';
import { CreatePaymentResponse } from '../../features/payment/models/PaymentResponse';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/payment`;


createPayment(
  purchaseType: 'Course' | 'PointPackage',
  courseId?: string,
  pointPackageId?: string
) {

  const body = {
    purchaseType: purchaseType,
    courseId: courseId,
    pointPackageId: pointPackageId
  };

  console.log('Payment Body:', body);

  return this.http.post<ApiResponse<CreatePaymentResponse>>(
    this.apiUrl,
    body
  );
}
  getPaymentStatus(paymentId: string): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.apiUrl}/${paymentId}/status`);
  }

  getPaymentDetails(paymentId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${paymentId}`);
  }

}