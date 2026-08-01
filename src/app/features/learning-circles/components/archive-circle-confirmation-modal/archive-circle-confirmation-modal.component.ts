import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-archive-circle-confirmation-modal',
  templateUrl: './archive-circle-confirmation-modal.component.html',
  styleUrl: './archive-circle-confirmation-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveCircleConfirmationModalComponent {
  readonly open = input(false);
  readonly circleName = input.required<string>();
  readonly loading = input(false);

  readonly confirmed = output<void>();
  readonly closed = output<void>();

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
