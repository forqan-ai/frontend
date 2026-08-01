import { DatePipe } from '@angular/common';
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

@Component({
  selector: 'app-learning-circle-card',
  imports: [DatePipe],
  templateUrl: './learning-circle-card.component.html',
  styleUrl: './learning-circle-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningCircleCardComponent {
  readonly circle = input.required<LearningCircleListItem>();
  readonly actionPending = input(false);

  readonly showPostsCount = input(false);
  readonly showRole = input(false);
  readonly showJoinAction = input(false);
  readonly showLeaveAction = input(false);
  readonly showManageAction = input(false);

  readonly joinRequested = output<LearningCircleListItem>();
  readonly leaveRequested = output<LearningCircleListItem>();
  readonly detailsRequested = output<LearningCircleListItem>();
  readonly manageRequested = output<LearningCircleListItem>();

  subjectInitial(subject: string): string {
    const normalizedSubject = subject.trim();

    return normalizedSubject
      ? normalizedSubject.charAt(0)
      : 'ت';
  }

  roleLabel(role: CircleRole | null): string | null {
    switch (role) {
      case CircleRole.Owner:
        return 'مالك الحلقة';

      case CircleRole.Moderator:
        return 'مشرف';

      case CircleRole.Member:
        return 'عضو';

      default:
        return null;
    }
  }
}
