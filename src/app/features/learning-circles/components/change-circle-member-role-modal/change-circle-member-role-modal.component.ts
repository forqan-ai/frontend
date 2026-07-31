import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';
import { ManageableCircleRole } from '../../models/circle-member.models';
import { CircleRole } from '../../models/learning-circle.models';

@Component({
  selector: 'app-change-circle-member-role-modal',
  templateUrl:
    './change-circle-member-role-modal.component.html',
  styleUrl:
    './change-circle-member-role-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeCircleMemberRoleModalComponent {
  readonly open = input(false);
  readonly memberName = input.required<string>();
  readonly currentRole =
    input.required<ManageableCircleRole>();
  readonly requestedRole =
    input.required<ManageableCircleRole>();
  readonly loading = input(false);

  readonly confirmed = output<void>();
  readonly closed = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.requestClose();
  }

  roleLabel(role: ManageableCircleRole): string {
    return role === CircleRole.Moderator
      ? 'مشرف'
      : 'عضو';
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
