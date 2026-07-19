import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IBooking } from '../../Models/booking.interface';
import { BookingsService } from '../../Services/bookings.service';
import { StatusBadgeComponent } from '../../Components/status-badge/status-badge.component';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, StatusBadgeComponent],
  templateUrl: './admin-bookings.component.html',
  styleUrl: './admin-bookings.component.css',
})
export class AdminBookingsComponent implements OnInit {
  private bookingsService = inject(BookingsService);

  loading = signal(true);
  error = signal(false);
  allBookings = signal<IBooking[]>([]);

  statusFilter = signal('');
  dateFilter = signal('');

  bookings = computed(() => {
    let list = this.allBookings();
    if (this.statusFilter()) {
      list = list.filter((b) => b.status === this.statusFilter());
    }
    if (this.dateFilter()) {
      list = list.filter((b) => b.bookedAt.slice(0, 10) === this.dateFilter());
    }
    return list;
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(false);

    this.bookingsService.getAllBookingsAdmin().subscribe({
      next: (res) => {
        this.allBookings.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
