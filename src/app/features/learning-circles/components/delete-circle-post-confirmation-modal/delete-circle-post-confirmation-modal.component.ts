import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-delete-circle-post-confirmation-modal',
  templateUrl:
    './delete-circle-post-confirmation-modal.component.html',
  styleUrl:
    './delete-circle-post-confirmation-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteCirclePostConfirmationModalComponent {
  readonly open = input(false);
  readonly authorName = input.required<string>();
  readonly contentPreview = input.required<string>();
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
