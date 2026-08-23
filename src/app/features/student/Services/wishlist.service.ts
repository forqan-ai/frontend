import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IWishlistItem, IToggleWishlistResponse } from '../Models/wishlist-item.interface';
import { ICourseCardDto } from '../../Course/Models/course-card-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/wishlist`;

  getWishlist(): Observable<ICourseCardDto[]> {
    return this.http.get<ICourseCardDto[]>(this.apiUrl);
  }

  toggleWishlist(courseId: string): Observable<IToggleWishlistResponse> {
    return this.http.post<IToggleWishlistResponse>(`${this.apiUrl}/${courseId}/toggle`, {});
  }

  getStatus(courseId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${courseId}/status`);
  }
}
