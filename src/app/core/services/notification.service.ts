import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppNotification } from '../models/notification.model';
import { Role } from '../models/auth.models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly api = `${environment.apiUrl}/api/notifications`;
  private initialized = false;

  readonly notifications = signal<AppNotification[]>([]);
  readonly unreadCount = signal(0);
  readonly loading = signal(false);
  readonly loadFailed = signal(false);
  readonly recentNotifications = computed(() => this.notifications().slice(0, 8));

  initialize(): void {
    if (this.initialized || !this.authService.IsAuthenticated()) return;
    this.initialized = true;
    this.reload();
  }

  reload(): void {
    if (!this.authService.IsAuthenticated()) return;
    this.loading.set(true);
    this.loadFailed.set(false);
    forkJoin({ notifications: this.getNotifications(), unreadCount: this.getUnreadCount() })
      .subscribe({
        next: ({ notifications, unreadCount }) => {
          this.notifications.set(notifications);
          this.unreadCount.set(unreadCount);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.loadFailed.set(true);
          this.initialized = false;
        },
      });
  }

  getNotifications(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(this.api);
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.api}/unread-count`);
  }

  markAsRead(notificationId: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.api}/${notificationId}/read`, null);
  }

  markAllAsRead(): void {
    if (this.unreadCount() === 0) return;
    this.http.patch<boolean>(`${this.api}/read-all`, null).subscribe({
      next: () => {
        this.notifications.update((items) => items.map((item) => ({ ...item, isRead: true })));
        this.unreadCount.set(0);
      },
    });
  }

  receive(notification: AppNotification): void {
    const existing = this.notifications().find((item) => item.notificationId === notification.notificationId);
    this.notifications.update((items) => [notification, ...items.filter((item) => item.notificationId !== notification.notificationId)]);
    if (!notification.isRead && (!existing || existing.isRead)) {
      this.unreadCount.update((count) => count + 1);
    }
  }

  open(notification: AppNotification): void {
    const navigate = () => {
      const destination = this.destinationFor(notification);
      if (destination) void this.router.navigate(destination);
    };

    if (notification.isRead) {
      navigate();
      return;
    }

    this.markAsRead(notification.notificationId).subscribe({
      next: () => {
        this.notifications.update((items) => items.map((item) =>
          item.notificationId === notification.notificationId ? { ...item, isRead: true } : item,
        ));
        this.unreadCount.update((count) => Math.max(0, count - 1));
        navigate();
      },
      error: navigate,
    });
  }

  clearSession(): void {
    this.initialized = false;
    this.notifications.set([]);
    this.unreadCount.set(0);
    this.loadFailed.set(false);
  }

  private destinationFor(notification: AppNotification): string[] | null {
    if (notification.referenceType?.toLowerCase() !== 'consultation' || !notification.referenceId) {
      return null;
    }

    const role = this.authService.getRole();
    if (role === Role.Student) return ['/student/consultations', notification.referenceId];
    if (role === Role.Teacher) return ['/teacher/consultations', notification.referenceId];
    return null;
  }
}
