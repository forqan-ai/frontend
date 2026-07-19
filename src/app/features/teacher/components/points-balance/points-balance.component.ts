import { Component, inject, OnInit, signal } from '@angular/core';
import { BookingsService } from '../../../live-sessions/Services/bookings.service';

@Component({
  selector: 'app-points-balance',
  standalone: true,
  templateUrl: './points-balance.component.html',
  styleUrl: './points-balance.component.css'
})
export class PointsBalanceComponent implements OnInit {
  private bookingsService = inject(BookingsService);

  balance = signal<number | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.bookingsService.getMyPointsBalance().subscribe({
      next: (b) => {
        this.balance.set(b);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
