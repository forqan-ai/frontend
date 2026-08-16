import { effect, inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import type { HubConnection } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppNotification } from '../models/notification.model';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class NotificationRealtimeService implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly toast = inject(ToastService);
  private readonly zone = inject(NgZone);
  private readonly receivedSubject = new Subject<AppNotification>();
  private connection: HubConnection | null = null;
  private startPromise: Promise<void> | null = null;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  readonly notificationReceived$ = this.receivedSubject.asObservable();

  constructor() {
    effect(() => {
      if (this.authService.isLoggedIn() && this.authService.getToken()) {
        void this.connect();
      } else {
        this.notificationService.clearSession();
        void this.disconnect();
      }
    });
  }

  async connect(): Promise<void> {
    if (!this.authService.isLoggedIn() || !this.authService.IsAuthenticated()) return;
    if (this.startPromise) return this.startPromise;

    this.startPromise = this.startConnection().finally(() => { this.startPromise = null; });
    await this.startPromise;
  }

  private async startConnection(): Promise<void> {
    const { HubConnectionBuilder, HubConnectionState, LogLevel } = await import('@microsoft/signalr');
    if (!this.authService.isLoggedIn() || !this.authService.IsAuthenticated()) return;
    if (this.connection?.state === HubConnectionState.Connected ||
        this.connection?.state === HubConnectionState.Connecting ||
        this.connection?.state === HubConnectionState.Reconnecting) return;

    if (!this.connection) {
      this.connection = new HubConnectionBuilder()
        .withUrl(`${environment.apiUrl}/notificationHub`, {
          accessTokenFactory: () => this.authService.getToken() ?? '',
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(LogLevel.Warning)
        .build();

      this.connection.on('ReceiveNotification', (notification: AppNotification) => {
        this.zone.run(() => {
          this.notificationService.receive(notification);
          this.toast.show(
            notification.title && notification.message
              ? `${notification.title}: ${notification.message}`
              : notification.message || notification.title,
          );
          this.receivedSubject.next(notification);
        });
      });
    }

    try {
      await this.connection.start();
      this.clearRetry();
    } catch {
      if (this.authService.isLoggedIn() && this.connection && !this.retryTimer) {
        this.retryTimer = setTimeout(() => {
          this.retryTimer = null;
          void this.connect();
        }, 5000);
      }
    }
  }

  async disconnect(): Promise<void> {
    const connection = this.connection;
    this.connection = null;
    this.startPromise = null;
    this.clearRetry();
    if (!connection) return;
    connection.off('ReceiveNotification');
    try { await connection.stop(); } catch { }
  }

  ngOnDestroy(): void {
    this.receivedSubject.complete();
    void this.disconnect();
  }

  private clearRetry(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }
}
