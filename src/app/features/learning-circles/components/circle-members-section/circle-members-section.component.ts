import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Subject,
  Subscription,
  debounceTime,
  finalize,
} from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { AddCircleMembersModalComponent } from '../add-circle-members-modal/add-circle-members-modal.component';
import { ChangeCircleMemberRoleModalComponent } from '../change-circle-member-role-modal/change-circle-member-role-modal.component';
import { CircleMemberCardComponent } from '../circle-member-card/circle-member-card.component';
import { LearningCirclesPaginationComponent } from '../learning-circles-pagination/learning-circles-pagination.component';
import { RemoveCircleMemberConfirmationModalComponent } from '../remove-circle-member-confirmation-modal/remove-circle-member-confirmation-modal.component';
import {
  CircleMember,
  ManageableCircleRole,
} from '../../models/circle-member.models';
import {
  CircleRole,
  LearningCircleDetails,
} from '../../models/learning-circle.models';
import {
  CircleMembersErrorService,
  CircleMembersLoadError,
} from '../../services/circle-members-error.service';
import { CircleMembersService } from '../../services/circle-members.service';
import { CircleChatSignalrService } from '../../../circle-chat/Services/circle-chat-signalr.service';

type PendingMemberAction = {
  type: 'remove' | 'role';
  memberUserId: string;
};

type RoleChangeSelection = {
  member: CircleMember;
  currentRole: ManageableCircleRole;
  requestedRole: ManageableCircleRole;
};

@Component({
  selector: 'app-circle-members-section',
  imports: [
    CircleMemberCardComponent,
    LearningCirclesPaginationComponent,
    AddCircleMembersModalComponent,
    RemoveCircleMemberConfirmationModalComponent,
    ChangeCircleMemberRoleModalComponent,
  ],
  templateUrl: './circle-members-section.component.html',
  styleUrl: './circle-members-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleMembersSectionComponent implements OnInit {
  private readonly membersService =
    inject(CircleMembersService);

  private readonly errorService =
    inject(CircleMembersErrorService);

  private readonly signalrService = inject(CircleChatSignalrService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly details = input.required<LearningCircleDetails>();
  readonly active = input(true);
  readonly detailsRefreshRequested = output<void>();

  readonly members = signal<CircleMember[]>([]);
  readonly searchInput = signal('');
  readonly searchTerm = signal('');
  readonly searchValidation = signal<string | null>(null);
  readonly pageNumber = signal(1);
  readonly pageSize = 10;
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);
  readonly loading = signal(false);
  readonly loadError =
    signal<CircleMembersLoadError | null>(null);

  readonly addModalOpen = signal(false);
  readonly memberToRemove = signal<CircleMember | null>(null);
  readonly roleChange =
    signal<RoleChangeSelection | null>(null);
  readonly pendingAction =
    signal<PendingMemberAction | null>(null);
  readonly onlineUserIds = signal<Set<string>>(new Set());

  readonly canManageMembers = computed(() => {
    const circle = this.details();

    return (
      !circle.isArchived &&
      circle.permissions.canManageMembers
    );
  });

  readonly canChangeRoles = computed(() => {
    const circle = this.details();

    return (
      !circle.isArchived &&
      circle.permissions.canChangeMemberRoles
    );
  });

  private readonly searchChanges = new Subject<string>();
  private listSubscription: Subscription | null = null;
  private requestId = 0;

  constructor() {
    this.searchChanges
      .pipe(
        debounceTime(350),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((search) => {
        this.searchTerm.set(search);
        this.pageNumber.set(1);

        if (search.length === 1) {
          return;
        }

        this.loadMembers();
      });

    this.signalrService.userOnline$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((userId) => {
        this.onlineUserIds.update((set) => {
          const next = new Set(set);
          next.add(userId);
          return next;
        });
      });

    this.signalrService.userOffline$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ userId }) => {
        this.onlineUserIds.update((set) => {
          const next = new Set(set);
          next.delete(userId);
          return next;
        });
      });

    effect(() => {
      const managementDisabled =
        !this.active() ||
        this.details().isArchived ||
        !this.details().permissions.canManageMembers;

      if (managementDisabled) {
        untracked(() => {
          this.addModalOpen.set(false);
          this.memberToRemove.set(null);
          this.roleChange.set(null);
        });
      }
    });
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  updateSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const search = value.trim();

    this.searchInput.set(value);
    this.pageNumber.set(1);
    this.searchChanges.next(search);

    if (search.length === 1) {
      this.searchValidation.set(
        'اكتب حرفين على الأقل للبحث.',
      );
      this.searchTerm.set(search);
      this.cancelRequest();
      this.resetMembers();
      return;
    }

    this.searchValidation.set(null);
  }

  clearSearch(): void {
    this.searchInput.set('');
    this.searchTerm.set('');
    this.searchValidation.set(null);
    this.pageNumber.set(1);
    this.cancelRequest();
    this.resetMembers();
    this.searchChanges.next('');
  }

  goToPage(page: number): void {
    this.pageNumber.set(page);
    this.loadMembers();
  }

  retry(): void {
    this.loadMembers();
  }

  openAddModal(): void {
    if (!this.canManageMembers() || this.pendingAction()) {
      return;
    }

    this.addModalOpen.set(true);
  }

  closeAddModal(): void {
    this.addModalOpen.set(false);
  }

  handleMembersAdded(): void {
    this.loadMembers();
    this.detailsRefreshRequested.emit();
  }

  handleMemberStateInvalidated(): void {
    this.addModalOpen.set(false);
    this.resyncState();
  }

  openRemoveConfirmation(member: CircleMember): void {
    if (
      !this.canManageMembers() ||
      !member.canRemove ||
      this.pendingAction()
    ) {
      return;
    }

    this.memberToRemove.set(member);
  }

  closeRemoveConfirmation(): void {
    if (!this.pendingAction()) {
      this.memberToRemove.set(null);
    }
  }

  confirmRemove(): void {
    const member = this.memberToRemove();

    if (
      !member ||
      !this.canManageMembers() ||
      !member.canRemove ||
      this.pendingAction()
    ) {
      return;
    }

    this.pendingAction.set({
      type: 'remove',
      memberUserId: member.userId,
    });

    this.membersService
      .removeMember(this.details().circleId, member.userId)
      .pipe(
        finalize(() => this.pendingAction.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (removed) => {
          if (!removed) {
            this.toast.show(
              'تعذر إزالة العضو من الحلقة. حاول مرة أخرى.',
              'error',
            );
            return;
          }

          if (
            this.members().length === 1 &&
            this.pageNumber() > 1
          ) {
            this.pageNumber.update((page) => page - 1);
          }

          this.memberToRemove.set(null);
          this.toast.show(
            `تمت إزالة ${member.fullName} من الحلقة.`,
          );
          this.loadMembers();
          this.detailsRefreshRequested.emit();
        },
        error: (error: HttpErrorResponse) => {
          this.toast.show(
            this.errorService.getActionMessage(
              error,
              'remove',
            ),
            'error',
          );

          if (this.errorService.shouldResync(error)) {
            this.memberToRemove.set(null);
            this.resyncState();
          }
        },
      });
  }

  openRoleConfirmation(
    member: CircleMember,
    requestedRole: ManageableCircleRole,
  ): void {
    if (
      !this.canChangeRoles() ||
      !member.canChangeRole ||
      this.pendingAction() ||
      requestedRole === member.role ||
      (
        member.role !== CircleRole.Member &&
        member.role !== CircleRole.Moderator
      )
    ) {
      return;
    }

    this.roleChange.set({
      member,
      currentRole: member.role,
      requestedRole,
    });
  }

  closeRoleConfirmation(): void {
    if (!this.pendingAction()) {
      this.roleChange.set(null);
    }
  }

  confirmRoleChange(): void {
    const selection = this.roleChange();

    if (
      !selection ||
      !this.canChangeRoles() ||
      !selection.member.canChangeRole ||
      this.pendingAction()
    ) {
      return;
    }

    this.pendingAction.set({
      type: 'role',
      memberUserId: selection.member.userId,
    });

    this.membersService
      .updateRole(
        this.details().circleId,
        selection.member.userId,
        { role: selection.requestedRole },
      )
      .pipe(
        finalize(() => this.pendingAction.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.roleChange.set(null);
          this.toast.show(
            `تم تحديث دور ${selection.member.fullName} بنجاح.`,
          );
          this.loadMembers();
          this.detailsRefreshRequested.emit();
        },
        error: (error: HttpErrorResponse) => {
          this.toast.show(
            this.errorService.getActionMessage(
              error,
              'role',
            ),
            'error',
          );

          if (this.errorService.shouldResync(error)) {
            this.roleChange.set(null);
            this.resyncState();
          }
        },
      });
  }

  isRemoving(member: CircleMember): boolean {
    const action = this.pendingAction();

    return (
      action?.type === 'remove' &&
      action.memberUserId === member.userId
    );
  }

  isChangingRole(member: CircleMember): boolean {
    const action = this.pendingAction();

    return (
      action?.type === 'role' &&
      action.memberUserId === member.userId
    );
  }

  isMemberOnline(member: CircleMember): boolean {
    return this.onlineUserIds().has(member.userId);
  }

  private loadMembers(): void {
    if (
      !this.details().permissions.canViewMembers ||
      this.searchTerm().length === 1
    ) {
      return;
    }

    const currentRequestId = ++this.requestId;

    this.listSubscription?.unsubscribe();
    this.loading.set(true);
    this.loadError.set(null);

    this.listSubscription = this.membersService
      .getMembers(this.details().circleId, {
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize,
        search: this.searchTerm() || undefined,
      })
      .pipe(
        finalize(() => {
          if (currentRequestId === this.requestId) {
            this.loading.set(false);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          if (currentRequestId !== this.requestId) {
            return;
          }

          if (
            result.totalPages > 0 &&
            this.pageNumber() > result.totalPages
          ) {
            this.pageNumber.set(result.totalPages);
            this.loadMembers();
            return;
          }

          this.members.set(result.items);
          this.totalCount.set(result.totalCount);
          this.totalPages.set(result.totalPages);
        },
        error: (error: HttpErrorResponse) => {
          if (currentRequestId !== this.requestId) {
            return;
          }

          this.resetMembers();
          this.loadError.set(
            this.errorService.getLoadError(error),
          );

          if (this.errorService.shouldResync(error)) {
            this.detailsRefreshRequested.emit();
          }
        },
      });
  }

  private resyncState(): void {
    this.loadMembers();
    this.detailsRefreshRequested.emit();
  }

  private cancelRequest(): void {
    ++this.requestId;
    this.listSubscription?.unsubscribe();
    this.listSubscription = null;
    this.loading.set(false);
  }

  private resetMembers(): void {
    this.members.set([]);
    this.totalCount.set(0);
    this.totalPages.set(0);
  }
}
