import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  CircleRole,
  LearningCircleListItem,
} from '../../models/learning-circle.models';
import { LearningCircleCardComponent } from '../learning-circle-card/learning-circle-card.component';

@Component({
  selector: 'app-learning-circles-grid',
  imports: [LearningCircleCardComponent],
  templateUrl: './learning-circles-grid.component.html',
  styleUrl: './learning-circles-grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningCirclesGridComponent {
  readonly circles =
    input.required<readonly LearningCircleListItem[]>();

  readonly loading = input(false);
  readonly actionCircleId = input<string | null>(null);

  readonly allowJoin = input(false);
  readonly showMemberMetadata = input(false);
  readonly allowMemberActions = input(false);

  readonly joinRequested = output<LearningCircleListItem>();
  readonly leaveRequested = output<LearningCircleListItem>();
  readonly detailsRequested = output<LearningCircleListItem>();
  readonly manageRequested = output<LearningCircleListItem>();

  canJoin(circle: LearningCircleListItem): boolean {
    return (
      this.allowJoin() &&
      !circle.isMember &&
      circle.isOpenForJoin
    );
  }

  canLeave(circle: LearningCircleListItem): boolean {
    return (
      this.allowMemberActions() &&
      circle.isMember &&
      circle.currentUserRole !== CircleRole.Owner
    );
  }

  canManage(circle: LearningCircleListItem): boolean {
    return (
      this.allowMemberActions() &&
      (
        circle.currentUserRole === CircleRole.Owner ||
        circle.currentUserRole === CircleRole.Moderator
      )
    );
  }

  isActionPending(circleId: string): boolean {
    return this.actionCircleId() === circleId;
  }
}
