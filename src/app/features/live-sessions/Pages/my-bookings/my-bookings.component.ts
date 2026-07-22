import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IBooking, BookingStatus } from '../../Models/booking.interface';
import { BookingsService } from '../../Services/bookings.service';
import { StatusBadgeComponent } from '../../Components/status-badge/status-badge.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, StatusBadgeComponent],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
})
export class MyBookingsComponent implements OnInit {
  private bookingsService = inject(BookingsService);

  loading = signal(true);
  error = signal(false);
  bookings = signal<IBooking[]>([]);

  BookingStatus = BookingStatus;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(false);

    this.bookingsService.getMyBookings().subscribe({
      next: (res) => {
        this.bookings.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  canCancel(b: IBooking): boolean {
    return b.status === BookingStatus.Pending || b.status === BookingStatus.Confirmed;
  }

  cancelBooking(b: IBooking): void {
    if (!confirm('هل تريد إلغاء هذا الحجز؟')) return;

    this.bookingsService.cancelBooking(b.bookingId).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error(err),
    });
  }
}
