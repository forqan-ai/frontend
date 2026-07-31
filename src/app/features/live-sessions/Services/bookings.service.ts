import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBooking } from '../Models/booking.interface';
import { environment } from '../../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  createBooking(sessionId: string): Observable<IBooking> {
    return this.http.post<IBooking>(`${this.apiUrl}/bookings`, { sessionId });
  }

  getMyBookings(): Observable<IBooking[]> {
    return this.http.get<IBooking[]>(`${this.apiUrl}/bookings/my`);
  }

  getBooking(bookingId: string): Observable<IBooking> {
    return this.http.get<IBooking>(`${this.apiUrl}/bookings/${bookingId}`);
  }

  confirmBooking(bookingId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/bookings/${bookingId}/confirm`, {});
  }

  cancelBooking(bookingId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/bookings/${bookingId}/cancel`, {});
  }

  completeBooking(bookingId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/bookings/${bookingId}/complete`, {});
  }

  getAllBookingsAdmin(): Observable<IBooking[]> {
    return this.http.get<IBooking[]>(`${this.apiUrl}/admin/bookings`);
  }

  getMyPointsBalance(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/PointPackages/balance`);
  }
  getSessionBookings(sessionId: string): Observable<IBooking[]> {
    return this.http.get<IBooking[]>(`${this.apiUrl}/sessions/${sessionId}/bookings`);
  }

}
