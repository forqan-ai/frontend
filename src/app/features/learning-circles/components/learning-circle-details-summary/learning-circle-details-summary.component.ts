import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  CircleRole,
  LearningCircleDetails,
} from '../../models/learning-circle.models';

@Component({
  selector: 'app-learning-circle-details-summary',
  imports: [DatePipe],
  templateUrl: './learning-circle-details-summary.component.html',
  styleUrl: './learning-circle-details-summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningCircleDetailsSummaryComponent {
  readonly details = input.required<LearningCircleDetails>();
  readonly actionPending = input(false);

  readonly joinRequested = output<void>();
  readonly leaveRequested = output<void>();
  readonly editRequested = output<void>();
  readonly archiveRequested = output<void>();

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
