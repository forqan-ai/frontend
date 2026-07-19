import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ILiveSession } from '../../Models/live-session.interface';
import { SessionsService } from '../../Services/sessions.service';
import { BookingsService } from '../../Services/bookings.service';
import { SessionCardComponent } from '../../Components/session-card/session-card.component';
import { BookingModalComponent } from '../../Components/booking-modal/booking-modal.component';
import { AuthService } from '../../../../core/services/auth.service';
import { Role } from '../../../../core/models/auth.models';

@Component({
  selector: 'app-circle-sessions',
  standalone: true,
  imports: [CommonModule, RouterLink, SessionCardComponent, BookingModalComponent],
  templateUrl: './circle-sessions.component.html',
  styleUrl: './circle-sessions.component.css',
})
export class CircleSessionsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private sessionsService = inject(SessionsService);
  private bookingsService = inject(BookingsService);
  private authService = inject(AuthService);

  circleId = '';

  loading = signal(true);
  error = signal(false);
  sessions = signal<ILiveSession[]>([]);
  bookedSessionIds = signal<Set<string>>(new Set());
  selectedSession = signal<ILiveSession | null>(null);

isTeacherOwner = computed(() => {
    return this.authService.hasRole(Role.Teacher);
});

  ngOnInit(): void {
    this.circleId = this.route.snapshot.paramMap.get('circleId') ?? '';
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(false);

    this.sessionsService.getCircleSessions(this.circleId).subscribe({
      next: (res) => {
        this.sessions.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set(true);
        this.loading.set(false);
      },
    });

    this.bookingsService.getMyBookings().subscribe({
      next: (res) => {
        this.bookedSessionIds.set(
          new Set(res.filter((b) => b.status !== 'Cancelled').map((b) => b.sessionId))
        );
      },
      error: (err) => console.error(err),
    });
  }

  openBooking(session: ILiveSession): void {
    this.selectedSession.set(session);
  }

  onBooked(): void {
    this.selectedSession.set(null);
    this.loadData();
  }

  cancelSession(session: ILiveSession): void {
    if (!confirm('هل أنت متأكد من إلغاء هذه الجلسة؟')) return;

    this.sessionsService.cancelSession(session.sessionId).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error(err),
    });
  }
}
