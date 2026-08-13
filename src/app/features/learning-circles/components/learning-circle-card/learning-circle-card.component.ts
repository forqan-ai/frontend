import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  CircleRole,
  CircleJoinPolicy,
  LearningCircleListItem,
} from '../../models/learning-circle.models';
import { CircleGeometricCoverComponent } from '../circle-geometric-cover/circle-geometric-cover.component';

@Component({
  selector: 'app-learning-circle-card',
  imports: [DatePipe, CircleGeometricCoverComponent],
  templateUrl: './learning-circle-card.component.html',
  styleUrl: './learning-circle-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningCircleCardComponent {
  private readonly cdr = inject(ChangeDetectorRef);

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

  private readonly failedUrls = signal<Set<string>>(new Set());

  hasValidImage(): boolean {
    const url = this.circle()?.teacher?.profileImageUrl;
    if (!url || !url.trim()) {
      return false;
    }
    return !this.failedUrls().has(url);
  }

  onImageError(): void {
    const url = this.circle()?.teacher?.profileImageUrl;
    if (url) {
      this.failedUrls.update((set) => {
        const next = new Set(set);
        next.add(url);
        return next;
      });
      this.cdr.markForCheck();
    }
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
