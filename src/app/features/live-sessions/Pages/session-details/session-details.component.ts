import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ILiveSession, SessionStatus } from '../../Models/live-session.interface';
import { IBooking, BookingStatus } from '../../Models/booking.interface';
import { SessionsService } from '../../Services/sessions.service';
import { BookingsService } from '../../Services/bookings.service';
import { StatusBadgeComponent } from '../../Components/status-badge/status-badge.component';
import { BookingModalComponent } from '../../Components/booking-modal/booking-modal.component';
import { AuthService } from '../../../../core/services/auth.service';
import { Role } from '../../../../core/models/auth.models';


@Component({
  selector: 'app-session-details',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, StatusBadgeComponent, BookingModalComponent],
  templateUrl: './session-details.component.html',
  styleUrl: './session-details.component.css',
})
export class SessionDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private sessionsService = inject(SessionsService);
  private bookingsService = inject(BookingsService);
  private authService = inject(AuthService);

  sessionId = '';

  loading = signal(true);
  error = signal(false);
  session = signal<ILiveSession | null>(null);
  myBooking = signal<IBooking | null>(null);
  attendees = signal<IBooking[]>([]);

  showBookingModal = signal(false);

  SessionStatus = SessionStatus;
  BookingStatus = BookingStatus;

  isTeacherOwner = signal(false);

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.paramMap.get('sessionId') ?? '';
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(false);

    this.sessionsService.getSession(this.sessionId).subscribe({
      next: (res) => {
        this.session.set(res);
        this.isTeacherOwner.set(this.authService.getRole() === Role.Teacher && this.authService.getUserId() === res.teacherId);

        if (this.isTeacherOwner()) {
          this.bookingsService.getSessionBookings(this.sessionId).subscribe({
            next: (bookings) => this.attendees.set(bookings),
            error: console.error
          });
        }

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
        this.myBooking.set(
          res.find((b) => b.sessionId === this.sessionId && b.status !== BookingStatus.Cancelled) ?? null
        );
      },
      error: (err) => console.error(err),
    });
  }

  canCancelBooking = computed(() => {
    const b = this.myBooking();
    return !!b && (b.status === BookingStatus.Pending || b.status === BookingStatus.Confirmed);
  });

  cancelBooking(): void {
    const b = this.myBooking();
    if (!b || !confirm('هل تريد إلغاء حجزك؟')) return;

    this.bookingsService.cancelBooking(b.bookingId).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error(err),
    });
  }

  cancelSession(): void {
    if (!confirm('هل أنت متأكد من إلغاء هذه الجلسة؟')) return;

    this.sessionsService.cancelSession(this.sessionId).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error(err),
    });
  }

  onBooked(): void {
    this.showBookingModal.set(false);
    this.loadData();
  }

  confirmAttendee(bookingId: string): void {
    if (!confirm('تأكيد حضور الطالب؟')) return;
    this.bookingsService.confirmBooking(bookingId).subscribe({
      next: () => this.loadData(),
      error: console.error
    });
  }

  completeAttendee(bookingId: string): void {
    if (!confirm('إكمال الجلسة وإضافة النقاط؟')) return;
    this.bookingsService.completeBooking(bookingId).subscribe({
      next: () => this.loadData(),
      error: console.error
    });
  }

}
