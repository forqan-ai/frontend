import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  CircleMember,
  ManageableCircleRole,
} from '../../models/circle-member.models';
import { CircleRole } from '../../models/learning-circle.models';

@Component({
  selector: 'app-circle-member-card',
  imports: [DatePipe],
  templateUrl: './circle-member-card.component.html',
  styleUrl: './circle-member-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleMemberCardComponent {
  readonly member = input.required<CircleMember>();
  readonly canManageMembers = input(false);
  readonly canChangeRoles = input(false);
  readonly actionsDisabled = input(false);
  readonly removing = input(false);
  readonly changingRole = input(false);

  readonly removeRequested = output<void>();
  readonly roleChangeRequested =
    output<ManageableCircleRole>();

  roleLabel(role: CircleRole): string {
    switch (role) {
      case CircleRole.Owner:
        return 'مالك الحلقة';
      case CircleRole.Moderator:
        return 'مشرف';
      case CircleRole.Member:
        return 'عضو';
    }
  }

  requestRoleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const currentRole = this.member().role;
    const requestedRole =
      select.value as ManageableCircleRole;

    select.value = currentRole;

    if (
      requestedRole === currentRole ||
      (
        requestedRole !== CircleRole.Member &&
        requestedRole !== CircleRole.Moderator
      )
    ) {
      return;
    }

    this.roleChangeRequested.emit(requestedRole);
  }
}
