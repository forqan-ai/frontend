import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Subscription,
  distinctUntilChanged,
  finalize,
  map,
} from 'rxjs';

import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

import { CircleChatComponent } from '../../../circle-chat/Components/circle-chat/circle-chat.component';
import { CircleSessionsComponent } from '../../../live-sessions/Pages/circle-sessions/circle-sessions.component';

import { ArchiveCircleConfirmationModalComponent } from '../../components/archive-circle-confirmation-modal/archive-circle-confirmation-modal.component';
import {
  CircleContentNavigationComponent,
  CircleContentSection,
} from '../../components/circle-content-navigation/circle-content-navigation.component';
import { CircleJoinRequestsSectionComponent } from '../../components/circle-join-requests-section/circle-join-requests-section.component';
import { CircleMembersSectionComponent } from '../../components/circle-members-section/circle-members-section.component';
import { CirclePostsSectionComponent } from '../../components/circle-posts-section/circle-posts-section.component';
import { LearningCircleDetailsSummaryComponent } from '../../components/learning-circle-details-summary/learning-circle-details-summary.component';
import { MembershipConfirmationModalComponent } from '../../components/membership-confirmation-modal/membership-confirmation-modal.component';

import { CircleMembershipAction } from '../../models/circle-action.models';
import {
  CircleRole,
  LearningCircleDetails,
} from '../../models/learning-circle.models';

import { CircleActionErrorService } from '../../services/circle-action-error.service';
import {
  CircleDetailsErrorService,
  CircleDetailsLoadError,
} from '../../services/circle-details-error.service';
import { CircleJoinRequestsService } from '../../services/circle-join-requests.service';
import { LearningCirclesService } from '../../services/learning-circles.service';

type DetailsAction =
  | CircleMembershipAction
  | 'archive';

@Component({
  selector: 'app-learning-circle-details',
  standalone: true,
  imports: [
    ToastComponent,
    LearningCircleDetailsSummaryComponent,
    CircleContentNavigationComponent,
    CirclePostsSectionComponent,
    CircleMembersSectionComponent,
    CircleJoinRequestsSectionComponent,
    CircleChatComponent,
    CircleSessionsComponent,
    MembershipConfirmationModalComponent,
    ArchiveCircleConfirmationModalComponent,
    DatePipe,
    ScrollRevealDirective,
  ],
  templateUrl: './learning-circle-details.component.html',
  styleUrl: './learning-circle-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningCircleDetailsComponent implements OnInit {
  private readonly circlesService = inject(LearningCirclesService);
  private readonly joinRequestsService = inject(CircleJoinRequestsService);
  private readonly actionErrorService = inject(CircleActionErrorService);
  private readonly detailsErrorService = inject(CircleDetailsErrorService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isManagementContext =
    this.route.snapshot.data['circleContext'] === 'management';

  readonly details = signal<LearningCircleDetails | null>(null);
  readonly loading = signal(false);
  readonly loadError = signal<CircleDetailsLoadError | null>(null);
  readonly actionPending = signal<DetailsAction | null>(null);
  readonly membershipAction =
    signal<CircleMembershipAction | null>(null);
  readonly archiveConfirmationOpen = signal(false);
  readonly activeContentSection =
    signal<CircleContentSection>('posts');

  readonly postsMounted = signal(false);
  readonly membersMounted = signal(false);
  readonly chatMounted = signal(false);
  readonly sessionsMounted = signal(false);

  private circleId = '';
  private contentCircleId = '';
  private loadSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('circleId') ?? ''),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((circleId) => {
        this.circleId = circleId;
        this.loadDetails();
      });
  }

  retry(): void {
    this.loadDetails();
  }

  roleLabel(role: CircleRole | null): string {
    switch (role) {
      case CircleRole.Owner:
        return 'مالك الحلقة';

      case CircleRole.Moderator:
        return 'مشرف';

      case CircleRole.Member:
        return 'عضو';

      default:
        return 'زائر';
    }
  }

  refreshDetailsFromContent(): void {
    this.loadDetails(true);
  }

  selectContentSection(section: CircleContentSection): void {
    const details = this.details();

    if (!details) {
      return;
    }

    const isParticipant =
      details.isMember || details.currentUserRole !== null;

    const allowed =
      section === 'posts'
        ? details.permissions.canViewPosts
        : section === 'members'
          ? details.permissions.canViewMembers
          : section === 'chat' || section === 'sessions'
            ? isParticipant
            : false;

    if (!allowed) {
      return;
    }

    this.activeContentSection.set(section);

    if (section === 'posts') {
      this.postsMounted.set(true);
    } else if (section === 'members') {
      this.membersMounted.set(true);
    } else if (section === 'chat') {
      this.chatMounted.set(true);
    } else if (section === 'sessions') {
      this.sessionsMounted.set(true);
    }
  }

  backToCircles(): void {
    if (this.router.url.startsWith('/student')) {
      void this.router.navigateByUrl('/student/learning-circles');
      return;
    }

    if (this.router.url.startsWith('/teacher')) {
      void this.router.navigateByUrl('/teacher/circles');
      return;
    }

    void this.router.navigateByUrl('/student/learning-circles');
  }

  editCircle(): void {
    const details = this.details();

    if (
      !details ||
      !details.permissions.canEditCircle ||
      this.actionPending()
    ) {
      return;
    }

    void this.router.navigate([
      '/teacher/circles',
      details.circleId,
      'edit',
    ]);
  }

  openJoinConfirmation(): void {
    const details = this.details();

    if (
      !details ||
      !details.permissions.canJoin ||
      this.actionPending()
    ) {
      return;
    }

    this.membershipAction.set('join');
  }

  openLeaveConfirmation(): void {
    const details = this.details();

    if (
      !details ||
      !details.permissions.canLeave ||
      this.actionPending()
    ) {
      return;
    }

    this.membershipAction.set('leave');
  }

  requestToJoin(): void {
    const details = this.details();

    if (
      !details?.permissions.canRequestToJoin ||
      this.actionPending()
    ) {
      return;
    }

    this.actionPending.set('join');

    this.joinRequestsService
      .create(details.circleId)
      .pipe(
        finalize(() => this.actionPending.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.toast.show('تم إرسال طلب الانضمام بنجاح.');
          this.loadDetails(true);
        },
        error: () => {
          this.toast.show(
            'تعذر إرسال طلب الانضمام.',
            'error',
          );
        },
      });
  }

  cancelJoinRequest(): void {
    const details = this.details();

    if (
      !details?.permissions.canCancelJoinRequest ||
      this.actionPending()
    ) {
      return;
    }

    this.actionPending.set('join');

    this.joinRequestsService
      .cancel(details.circleId)
      .pipe(
        finalize(() => this.actionPending.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.toast.show('تم إلغاء طلب الانضمام.');
          this.loadDetails(true);
        },
        error: () => {
          this.toast.show(
            'تعذر إلغاء طلب الانضمام.',
            'error',
          );
        },
      });
  }

  closeMembershipConfirmation(): void {
    if (!this.actionPending()) {
      this.membershipAction.set(null);
    }
  }

  confirmMembershipAction(): void {
    const action = this.membershipAction();
    const details = this.details();

    if (
      !action ||
      !details ||
      this.actionPending()
    ) {
      return;
    }

    const request$ =
      action === 'join'
        ? this.circlesService.join(details.circleId)
        : this.circlesService.leave(details.circleId);

    this.actionPending.set(action);

    request$
      .pipe(
        finalize(() => this.actionPending.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (succeeded) => {
          if (!succeeded) {
            this.toast.show(
              action === 'join'
                ? 'تعذر الانضمام إلى الحلقة. حاول مرة أخرى.'
                : 'تعذر مغادرة الحلقة. حاول مرة أخرى.',
              'error',
            );

            return;
          }

          this.membershipAction.set(null);

          this.toast.show(
            action === 'join'
              ? 'تم الانضمام إلى حلقة التعلم بنجاح.'
              : 'تمت مغادرة حلقة التعلم بنجاح.',
          );

          this.loadDetails(true);
        },

        error: (error: HttpErrorResponse) => {
          this.toast.show(
            this.actionErrorService.getMessage(
              error,
              action,
            ),
            'error',
          );

          if (this.shouldResync(error)) {
            this.membershipAction.set(null);
            this.loadDetails(error.status !== 404);
          }
        },
      });
  }

  openArchiveConfirmation(): void {
    const details = this.details();

    if (
      !details ||
      !details.permissions.canArchiveCircle ||
      this.actionPending()
    ) {
      return;
    }

    this.archiveConfirmationOpen.set(true);
  }

  closeArchiveConfirmation(): void {
    if (!this.actionPending()) {
      this.archiveConfirmationOpen.set(false);
    }
  }

  confirmArchive(): void {
    const details = this.details();

    if (
      !details ||
      !details.permissions.canArchiveCircle ||
      this.actionPending()
    ) {
      return;
    }

    this.actionPending.set('archive');

    this.circlesService
      .archive(details.circleId)
      .pipe(
        finalize(() => this.actionPending.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (archived) => {
          if (!archived) {
            this.toast.show(
              'تعذر أرشفة الحلقة. حاول مرة أخرى.',
              'error',
            );

            return;
          }

          this.archiveConfirmationOpen.set(false);

          this.toast.show(
            'تمت أرشفة حلقة التعلم بنجاح.',
          );

          this.loadDetails(true);
        },

        error: (error: HttpErrorResponse) => {
          this.toast.show(
            this.detailsErrorService.getArchiveMessage(error),
            'error',
          );

          if (this.shouldResync(error)) {
            this.archiveConfirmationOpen.set(false);
            this.loadDetails(error.status !== 404);
          }
        },
      });
  }

  private loadDetails(
    preserveContent = false,
  ): void {
    this.loadSubscription?.unsubscribe();
    this.loadSubscription = null;

    if (!this.circleId) {
      this.loading.set(false);
      this.details.set(null);

      this.loadError.set({
        title: 'رابط الحلقة غير صالح',
        message: 'تعذر تحديد حلقة التعلم المطلوبة.',
        retryable: false,
      });

      return;
    }

    if (!preserveContent) {
      this.loading.set(true);
      this.details.set(null);
      this.loadError.set(null);
    }

    this.loadSubscription = this.circlesService
      .getDetails(this.circleId)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (details) => {
          const contextualDetails =
            this.applyContextPermissions(details);

          this.details.set(contextualDetails);
          this.syncContentState(contextualDetails);
          this.loadError.set(null);
        },

        error: (error: HttpErrorResponse) => {
          const loadError =
            this.detailsErrorService.getLoadError(error);

          if (preserveContent && this.details()) {
            this.toast.show(
              'تعذر تحديث بيانات الحلقة. حاول مرة أخرى.',
              'error',
            );

            return;
          }

          this.details.set(null);
          this.loadError.set(loadError);
        },
      });
  }

  private shouldResync(
    error: HttpErrorResponse,
  ): boolean {
    return (
      error.status === 403 ||
      error.status === 404 ||
      error.status === 409
    );
  }

  private applyContextPermissions(
    details: LearningCircleDetails,
  ): LearningCircleDetails {
    if (this.isManagementContext) {
      return details;
    }

    return {
      ...details,
      permissions: {
        ...details.permissions,
        canCreatePost: false,
        canPinPosts: false,
        canManageMembers: false,
        canChangeMemberRoles: false,
        canEditCircle: false,
        canArchiveCircle: false,
        canCreateLiveSession: false,
      },
    };
  }

  private syncContentState(
    details: LearningCircleDetails,
  ): void {
    const circleChanged =
      this.contentCircleId !== details.circleId;

    if (circleChanged) {
      this.contentCircleId = details.circleId;

      this.postsMounted.set(false);
      this.membersMounted.set(false);
      this.chatMounted.set(false);
      this.sessionsMounted.set(false);
    }

    const canViewPosts =
      details.permissions.canViewPosts;

    const canViewMembers =
      details.permissions.canViewMembers;

    const isParticipant =
      details.isMember ||
      details.currentUserRole !== null;

    if (!canViewPosts) {
      this.postsMounted.set(false);
    }

    if (!canViewMembers) {
      this.membersMounted.set(false);
    }

    if (!isParticipant) {
      this.chatMounted.set(false);
      this.sessionsMounted.set(false);
    }

    const currentSection =
      this.activeContentSection();

    const currentAllowed = (() => {
      if (currentSection === 'posts') {
        return canViewPosts;
      }

      if (currentSection === 'members') {
        return canViewMembers;
      }

      if (
        currentSection === 'chat' ||
        currentSection === 'sessions'
      ) {
        return isParticipant;
      }

      return false;
    })();

    const hasAnyContent =
      canViewPosts ||
      canViewMembers ||
      isParticipant;

    if (!hasAnyContent) {
      this.activeContentSection.set('posts');
      return;
    }

    const nextSection =
      circleChanged || !currentAllowed
        ? canViewPosts
          ? 'posts'
          : canViewMembers
            ? 'members'
            : 'chat'
        : currentSection;

    this.activeContentSection.set(nextSection);

    if (nextSection === 'posts') {
      this.postsMounted.set(true);
    } else if (nextSection === 'members') {
      this.membersMounted.set(true);
    } else if (nextSection === 'chat') {
      this.chatMounted.set(true);
    } else if (nextSection === 'sessions') {
      this.sessionsMounted.set(true);
    }
  }
}