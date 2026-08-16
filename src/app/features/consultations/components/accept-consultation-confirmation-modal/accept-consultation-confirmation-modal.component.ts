import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-accept-consultation-confirmation-modal',
  templateUrl: './accept-consultation-confirmation-modal.component.html',
  styleUrl: './accept-consultation-confirmation-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptConsultationConfirmationModalComponent {
  readonly open = input(false);
  readonly teacherName = input.required<string>();
  readonly appointment = input.required<string>();
  readonly durationMinutes = input.required<number>();
  readonly pointsPrice = input.required<number>();
  readonly loading = input(false);

  readonly closed = output<void>();
  readonly confirmed = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.requestClose();
  }

  requestClose(): void {
    if (this.open() && !this.loading()) {
      this.closed.emit();
    }
  }

  confirm(): void {
    if (!this.loading()) {
      this.confirmed.emit();
    }
  }
}
