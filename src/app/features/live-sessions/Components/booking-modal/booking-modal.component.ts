import { Component, computed, inject, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ILiveSession } from '../../Models/live-session.interface';
import { BookingsService } from '../../Services/bookings.service';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-modal.component.html',
  styleUrl: './booking-modal.component.css',
})
export class BookingModalComponent implements OnInit {
  private bookingsService = inject(BookingsService);

  session = input.required<ILiveSession>();

  closed = output<void>();
  booked = output<void>();

  balance = signal<number | null>(null);
  submitting = signal(false);
  success = signal(false);
  errorMsg = signal<string | null>(null);

  isFree = computed(() => this.session().pointsPrice === 0);

  ngOnInit(): void {
    this.bookingsService.getMyPointsBalance().subscribe({
      next: (b) => this.balance.set(b),
      error: (err) => console.error(err),
    });
  }

  get insufficient(): boolean {
    const b = this.balance();
    return b !== null && !this.isFree() && b < this.session().pointsPrice;
  }

  confirm(): void {
    if (this.submitting() || this.insufficient) return;
    this.submitting.set(true);
    this.errorMsg.set(null);

    this.bookingsService.createBooking(this.session().sessionId).subscribe({
      next: () => {
        this.submitting.set(false);
        this.success.set(true);
        setTimeout(() => this.booked.emit(), 1600);
      },
      error: (err) => {
        console.error(err);
        this.submitting.set(false);
        const msg = typeof err.error === 'string' && err.error
          ? err.error
          : 'حدث خطأ أثناء الحجز، حاول مرة أخرى.';
        this.errorMsg.set(msg);
      },
    });
  }
}
