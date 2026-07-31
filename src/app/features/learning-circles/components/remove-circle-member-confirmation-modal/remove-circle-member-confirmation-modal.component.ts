import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-remove-circle-member-confirmation-modal',
  templateUrl:
    './remove-circle-member-confirmation-modal.component.html',
  styleUrl:
    './remove-circle-member-confirmation-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveCircleMemberConfirmationModalComponent {
  readonly open = input(false);
  readonly memberName = input.required<string>();
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
