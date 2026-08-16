import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input, signal } from '@angular/core';
import { AppNotification } from '../../../core/models/notification.model';
import { NotificationRealtimeService } from '../../../core/services/notification-realtime.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationBellComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly realtime = inject(NotificationRealtimeService);
  readonly notificationService = inject(NotificationService);
  readonly theme = input<'light' | 'dark'>('light');
  readonly menuAlign = input<'start' | 'end'>('end');
  readonly open = signal(false);

  constructor() {
    this.notificationService.initialize();
    void this.realtime.connect();
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.open.update((value) => !value);
  }

  select(notification: AppNotification): void {
    this.open.set(false);
    this.notificationService.open(notification);
  }

  formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('ar-EG', { dateStyle: 'short', timeStyle: 'short' }).format(date);
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) this.open.set(false);
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void { this.open.set(false); }
}
