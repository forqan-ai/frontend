import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span class="status-badge" [class]="'status-badge ' + cssClass()">
      <i class="bi" [class]="'bi ' + icon()"></i>
      {{ label() }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 14px;
      border-radius: 999px;
    }
    .status-badge i { font-size: 11px; }
    .st-upcoming { background-color: var(--primary-light); color: var(--primary); }
    .st-ongoing { background-color: rgba(193, 102, 60, 0.12); color: #c1663c; }
    .st-completed { background-color: rgba(110, 143, 107, 0.14); color: #6e8f6b; }
    .st-cancelled { background-color: var(--border); color: var(--text-light); }
    .st-pending { background-color: rgba(193, 102, 60, 0.12); color: #c1663c; }
    .st-confirmed { background-color: var(--primary-light); color: var(--primary); }
  `],
})
export class StatusBadgeComponent {
  status = input.required<string>();

  cssClass = computed(() => {
    switch (this.status()) {
      case 'Upcoming': return 'st-upcoming';
      case 'Ongoing': return 'st-ongoing';
      case 'Completed': return 'st-completed';
      case 'Cancelled': return 'st-cancelled';
      case 'Pending': return 'st-pending';
      case 'Confirmed': return 'st-confirmed';
      default: return 'st-upcoming';
    }
  });

  label = computed(() => {
    switch (this.status()) {
      case 'Upcoming': return 'قادمة';
      case 'Ongoing': return 'جارية الآن';
      case 'Completed': return 'مكتملة';
      case 'Cancelled': return 'ملغاة';
      case 'Pending': return 'قيد الانتظار';
      case 'Confirmed': return 'مؤكد';
      default: return this.status();
    }
  });

  icon = computed(() => {
    switch (this.status()) {
      case 'Upcoming': return 'bi-calendar-event';
      case 'Ongoing': return 'bi-broadcast';
      case 'Completed': return 'bi-check-circle-fill';
      case 'Cancelled': return 'bi-x-circle';
      case 'Pending': return 'bi-hourglass-split';
      case 'Confirmed': return 'bi-check-circle';
      default: return 'bi-circle';
    }
  });
}
