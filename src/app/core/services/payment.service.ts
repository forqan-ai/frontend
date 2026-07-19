import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResponse, CheckoutUrl } from '../models/APIResponse';

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
    let params = new HttpParams()
      .set('PurchaseType', purchaseType);

    if (courseId) {
      params = params.set('CourseId', courseId);
    }

    if (pointPackageId) {
      params = params.set('PointPackageId', pointPackageId);
    }

    return this.http.post<ApiResponse<CheckoutUrl>>(this.apiUrl, {}, { params });
  }
}