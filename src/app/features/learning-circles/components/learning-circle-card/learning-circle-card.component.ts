import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  CircleJoinPolicy,
  CircleRole,
  LearningCircleListItem,
} from '../../models/learning-circle.models';

import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { CircleGeometricCoverComponent } from '../circle-geometric-cover/circle-geometric-cover.component';

@Component({
  selector: 'app-learning-circle-card',
  imports: [
    DatePipe,
    CircleGeometricCoverComponent,
    ScrollRevealDirective,
  ],
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
  readonly showRequestAction = input(false);
  readonly showCancelRequestAction = input(false);
  readonly showLeaveAction = input(false);
  readonly showManageAction = input(false);

  readonly joinRequested = output<LearningCircleListItem>();
  readonly joinRequestSubmitted = output<LearningCircleListItem>();
  readonly joinRequestCancelled = output<LearningCircleListItem>();
  readonly leaveRequested = output<LearningCircleListItem>();
  readonly detailsRequested = output<LearningCircleListItem>();
  readonly manageRequested = output<LearningCircleListItem>();

  readonly CircleJoinPolicy = CircleJoinPolicy;

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

