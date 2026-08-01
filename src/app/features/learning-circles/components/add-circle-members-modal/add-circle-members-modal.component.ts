import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
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
  FieldTree,
  FormField,
  form,
  submit,
  validate,
} from '@angular/forms/signals';
import {
  Subject,
  Subscription,
  debounceTime,
  finalize,
  firstValueFrom,
} from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { LearningCirclesPaginationComponent } from '../learning-circles-pagination/learning-circles-pagination.component';
import {
  AddCircleMemberStatus,
  AddCircleMembersResponse,
  CircleMemberCandidate,
} from '../../models/circle-member.models';
import { CircleMembersErrorService } from '../../services/circle-members-error.service';
import { CircleMembersService } from '../../services/circle-members.service';

interface AddMembersFormModel {
  emailsText: string;
}

const EMPTY_ADD_MEMBERS_FORM: AddMembersFormModel = {
  emailsText: '',
};

@Component({
  selector: 'app-add-circle-members-modal',
  imports: [
    FormField,
    LearningCirclesPaginationComponent,
  ],
  templateUrl: './add-circle-members-modal.component.html',
  styleUrl: './add-circle-members-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCircleMembersModalComponent {
  private readonly membersService =
    inject(CircleMembersService);

  private readonly errorService =
    inject(CircleMembersErrorService);

  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly open = input(false);
  readonly circleId = input.required<string>();
  readonly circleName = input.required<string>();

  readonly closed = output<void>();
  readonly membersAdded = output<number>();
  readonly stateRefreshRequested = output<void>();

  readonly candidateSearch = signal('');
  readonly candidateSearchValidation =
    signal<string | null>(null);
  readonly candidates = signal<CircleMemberCandidate[]>([]);
  readonly candidatePage = signal(1);
  readonly candidatePageSize = 6;
  readonly candidateTotalCount = signal(0);
  readonly candidateTotalPages = signal(0);
  readonly candidatesLoading = signal(false);
  readonly candidatesLoadFailed = signal(false);

  readonly selectedEmails = signal<string[]>([]);
  readonly additionResult =
    signal<AddCircleMembersResponse | null>(null);
  readonly adding = signal(false);

  private readonly addMembersModel =
    signal<AddMembersFormModel>({
      ...EMPTY_ADD_MEMBERS_FORM,
    });

  readonly addMembersForm = form(
    this.addMembersModel,
    (model) => {
      validate(model.emailsText, ({ value }) => {
        const emails = this.mergeEmails(
          value(),
          this.selectedEmails(),
        );

        if (emails.length === 0) {
          return {
            kind: 'emails-required',
            message:
              'اختر طالبًا أو أدخل بريدًا إلكترونيًا واحدًا على الأقل.',
          };
        }

        if (emails.length > 50) {
          return {
            kind: 'emails-limit',
            message:
              'يمكن إضافة 50 بريدًا إلكترونيًا كحد أقصى في الطلب الواحد.',
          };
        }

        return undefined;
      });
    },
  );

  readonly emailsToAdd = computed(() =>
    this.mergeEmails(
      this.addMembersModel().emailsText,
      this.selectedEmails(),
    ),
  );

  private readonly candidateSearchChanges =
    new Subject<string>();

  private candidatesSubscription: Subscription | null = null;
  private candidateRequestId = 0;

  constructor() {
    this.candidateSearchChanges
      .pipe(
        debounceTime(350),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.loadCandidates());

    effect(() => {
      const modalOpen = this.open();

      if (!modalOpen) {
        untracked(() => this.resetModal());
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.requestClose();
  }

  updateCandidateSearch(event: Event): void {
    const value =
      (event.target as HTMLInputElement).value.trim();

    this.candidateSearch.set(value);
    this.candidatePage.set(1);
    this.candidatesLoadFailed.set(false);
    this.candidateSearchChanges.next(value);

    if (value.length === 1) {
      this.candidateSearchValidation.set(
        'اكتب حرفين على الأقل للبحث.',
      );
      this.cancelCandidatesRequest();
      this.resetCandidates();
      return;
    }

    this.candidateSearchValidation.set(null);

    if (value.length < 2) {
      this.cancelCandidatesRequest();
      this.resetCandidates();
      return;
    }

  }

  addCandidate(candidate: CircleMemberCandidate): void {
    if (
      this.adding() ||
      this.isEmailSelected(candidate.email) ||
      this.emailsToAdd().length >= 50
    ) {
      return;
    }

    this.selectedEmails.update((emails) => [
      ...emails,
      candidate.email,
    ]);
  }

  removeSelectedEmail(email: string): void {
    if (this.adding()) {
      return;
    }

    this.selectedEmails.update((emails) =>
      emails.filter(
        (item) =>
          item.localeCompare(email, undefined, {
            sensitivity: 'accent',
          }) !== 0,
      ),
    );
  }

  isEmailSelected(email: string): boolean {
    const normalizedEmail = email.toUpperCase();

    return this.emailsToAdd().some(
      (item) => item.toUpperCase() === normalizedEmail,
    );
  }

  goToCandidatePage(page: number): void {
    this.candidatePage.set(page);
    this.loadCandidates();
  }

  retryCandidates(): void {
    this.loadCandidates();
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.adding()) {
      return;
    }

    void submit(this.addMembersForm, {
      action: async () => {
        const emails = this.emailsToAdd();

        if (emails.length === 0 || emails.length > 50) {
          return undefined;
        }

        this.adding.set(true);

        try {
          const response = await firstValueFrom(
            this.membersService
              .addMembers(this.circleId(), { emails })
              .pipe(takeUntilDestroyed(this.destroyRef)),
          );

          this.additionResult.set(response);
          this.selectedEmails.set([]);
          this.addMembersForm().reset({
            ...EMPTY_ADD_MEMBERS_FORM,
          });

          if (response.addedCount > 0) {
            this.membersAdded.emit(response.addedCount);
            this.toast.show(
              response.addedCount === 1
                ? 'تمت إضافة طالب واحد إلى الحلقة.'
                : `تمت إضافة ${response.addedCount} طلاب إلى الحلقة.`,
            );

            if (this.candidateSearch().length >= 2) {
              this.loadCandidates();
            }
          }
        } catch (error: unknown) {
          const httpError =
            error instanceof HttpErrorResponse
              ? error
              : new HttpErrorResponse({ status: 0 });

          this.toast.show(
            this.errorService.getActionMessage(
              httpError,
              'add',
            ),
            'error',
          );

          if (this.errorService.shouldResync(httpError)) {
            this.resetModal();
            this.stateRefreshRequested.emit();
          }
        } finally {
          this.adding.set(false);
        }

        return undefined;
      },
    });
  }

  startAnotherAddition(): void {
    if (this.adding()) {
      return;
    }

    this.additionResult.set(null);
    this.addMembersForm().reset({
      ...EMPTY_ADD_MEMBERS_FORM,
    });
  }

  requestClose(): void {
    if (!this.open() || this.adding()) {
      return;
    }

    this.resetModal();
    this.closed.emit();
  }

  showFormError(field: FieldTree<string>): boolean {
    return field().touched() && field().invalid();
  }

  formErrorMessage(field: FieldTree<string>): string {
    return field().errors()[0]?.message ??
      'تحقق من قائمة البريد الإلكتروني.';
  }

  statusLabel(status: AddCircleMemberStatus): string {
    return this.errorService.additionStatusLabel(status);
  }

  isAdded(status: AddCircleMemberStatus): boolean {
    return status === AddCircleMemberStatus.Added;
  }

  private loadCandidates(): void {
    const search = this.candidateSearch();

    if (!this.open() || search.length < 2) {
      return;
    }

    const currentRequestId = ++this.candidateRequestId;

    this.candidatesSubscription?.unsubscribe();
    this.candidatesLoading.set(true);
    this.candidatesLoadFailed.set(false);

    this.candidatesSubscription = this.membersService
      .searchCandidates(this.circleId(), {
        pageNumber: this.candidatePage(),
        pageSize: this.candidatePageSize,
        search,
      })
      .pipe(
        finalize(() => {
          if (currentRequestId === this.candidateRequestId) {
            this.candidatesLoading.set(false);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          if (currentRequestId !== this.candidateRequestId) {
            return;
          }

          if (
            result.totalPages > 0 &&
            this.candidatePage() > result.totalPages
          ) {
            this.candidatePage.set(result.totalPages);
            this.loadCandidates();
            return;
          }

          this.candidates.set(result.items);
          this.candidateTotalCount.set(result.totalCount);
          this.candidateTotalPages.set(result.totalPages);
        },
        error: (error: HttpErrorResponse) => {
          if (currentRequestId !== this.candidateRequestId) {
            return;
          }

          this.resetCandidates();
          this.candidatesLoadFailed.set(true);

          if (this.errorService.shouldResync(error)) {
            this.resetModal();
            this.stateRefreshRequested.emit();
          }
        },
      });
  }

  private cancelCandidatesRequest(): void {
    ++this.candidateRequestId;
    this.candidatesSubscription?.unsubscribe();
    this.candidatesSubscription = null;
    this.candidatesLoading.set(false);
  }

  private resetCandidates(): void {
    this.candidates.set([]);
    this.candidateTotalCount.set(0);
    this.candidateTotalPages.set(0);
  }

  private resetModal(): void {
    this.cancelCandidatesRequest();
    this.candidateSearch.set('');
    this.candidateSearchValidation.set(null);
    this.candidatePage.set(1);
    this.candidatesLoadFailed.set(false);
    this.resetCandidates();
    this.selectedEmails.set([]);
    this.additionResult.set(null);
    this.addMembersForm().reset({
      ...EMPTY_ADD_MEMBERS_FORM,
    });
  }

  private mergeEmails(
    emailsText: string,
    selectedEmails: string[],
  ): string[] {
    const manualEmails = emailsText
      .split(/[\n,;]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    const uniqueEmails: string[] = [];
    const normalizedEmails = new Set<string>();

    for (const email of [...manualEmails, ...selectedEmails]) {
      const normalizedEmail = email.toUpperCase();

      if (!normalizedEmails.has(normalizedEmail)) {
        normalizedEmails.add(normalizedEmail);
        uniqueEmails.push(email);
      }
    }

    return uniqueEmails;
  }
}
