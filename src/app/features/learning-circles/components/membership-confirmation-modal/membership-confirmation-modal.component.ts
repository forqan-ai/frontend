import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';
import { CircleMembershipAction } from '../../models/circle-action.models';

@Component({
  selector: 'app-membership-confirmation-modal',
  templateUrl: './membership-confirmation-modal.component.html',
  styleUrl: './membership-confirmation-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembershipConfirmationModalComponent {
  readonly open = input(false);
  readonly action = input.required<CircleMembershipAction>();
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
