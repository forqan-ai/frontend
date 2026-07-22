import { Component, computed, input, output, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ILiveSession, SessionStatus } from '../../Models/live-session.interface';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-session-card',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, StatusBadgeComponent],
  templateUrl: './session-card.component.html',
  styleUrl: './session-card.component.css',
})
export class SessionCardComponent implements OnInit, OnDestroy {
  session = input.required<ILiveSession>();
  isTeacherOwner = input(false);
  isBooked = input(false);

  book = output<ILiveSession>();
  cancel = output<ILiveSession>();

  SessionStatus = SessionStatus;

  private now = signal(Date.now());
  private timer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.timer = setInterval(() => this.now.set(Date.now()), 60_000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  isFree = computed(() => this.session().pointsPrice === 0);

  countdown = computed(() => {
    const diff = new Date(this.session().sessionDate).getTime() - this.now();
    if (diff <= 0 || this.session().status !== SessionStatus.Upcoming) return null;

    const mins = Math.floor(diff / 60_000);
    if (mins < 60) return `تبدأ خلال ${mins} دقيقة`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return `تبدأ خلال ${hours} ساعة`;

    return `تبدأ خلال ${Math.floor(hours / 24)} يوم`;
  });

  canBook = computed(
    () => !this.isBooked() && this.session().status === SessionStatus.Upcoming
  );
}
