import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, finalize } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { NotificationRealtimeService } from '../../../../core/services/notification-realtime.service';
import { ConsultationProposalFormComponent } from '../../components/consultation-proposal-form/consultation-proposal-form.component';
import { MeetingLinkFormComponent } from '../../components/meeting-link-form/meeting-link-form.component';
import { TeacherConsultationActionModalComponent } from '../../components/teacher-consultation-action-modal/teacher-consultation-action-modal.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import {
  ConsultationApiFailure,
  ConsultationDetails,
  ConsultationProposalRequest,
  SetMeetingLinkRequest,
  TeacherConsultationAction,
  consultationStatusClass,
  teacherConsultationStatusLabel,
  formatConsultationDate,
} from '../../models/consultation.models';
import { ConsultationService } from '../../services/consultation.service';

interface DetailsError {
  title: string;
  message: string;
  retryable: boolean;
}

type Submission = 'proposal' | 'meeting' | TeacherConsultationAction;

@Component({
  selector: 'app-teacher-consultation-details',
  imports: [
    RouterLink,
    ScrollRevealDirective,
    ConsultationProposalFormComponent,
    MeetingLinkFormComponent,
    TeacherConsultationActionModalComponent,
  ],
  templateUrl: './teacher-consultation-details.component.html',
  styleUrl: './teacher-consultation-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherConsultationDetailsComponent implements OnInit {
  private readonly consultationService = inject(ConsultationService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationRealtime = inject(NotificationRealtimeService);

  readonly consultation = signal<ConsultationDetails | null>(null);
  readonly loading = signal(false);
  readonly loadError = signal<DetailsError | null>(null);
  readonly actionError = signal('');
  readonly submitting = signal<Submission | null>(null);
  readonly actionModal = signal<TeacherConsultationAction | null>(null);

  readonly statusLabel = teacherConsultationStatusLabel;
  readonly statusClass = consultationStatusClass;
  readonly formatDate = formatConsultationDate;

  private consultationId = '';

  ngOnInit(): void {
    this.consultationId =
      this.route.snapshot.paramMap.get('consultationId') ?? '';

    if (!this.consultationId) {
      this.loadError.set({
        title: 'تعذر فتح الاستشارة',
        message: 'معرّف الاستشارة غير صالح.',
        retryable: false,
      });
      return;
    }

    this.loadConsultation();

    this.notificationRealtime.notificationReceived$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((notification) => {
        if (
          notification.referenceType?.toLowerCase() === 'consultation' &&
          notification.referenceId?.toLowerCase() ===
            this.consultationId.toLowerCase()
        ) {
          this.loadConsultation();
        }
      });
  }

  loadConsultation(preserveActionError = false): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.actionModal.set(null);

    if (!preserveActionError) {
      this.actionError.set('');
    }

    this.consultationService
      .getConsultationById(this.consultationId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (consultation) => {
          this.consultation.set(consultation);
        },
        error: (error: HttpErrorResponse) => {
          this.consultation.set(null);
          this.loadError.set(this.detailsErrorFor(error));
        },
      });
  }

  saveProposal(request: ConsultationProposalRequest): void {
    const details = this.consultation();

    if (!details?.actions.canEditProposal || this.submitting()) {
      return;
    }

    const successMessage =
      details.status === 'Requested'
        ? 'تم إرسال عرض الاستشارة إلى الطالب بنجاح.'
        : 'تم حفظ تعديلات عرض الاستشارة بنجاح.';

    this.runMutation(
      'proposal',
      this.consultationService.updateProposal(
        this.consultationId,
        request
      ),
      successMessage
    );
  }

  saveMeetingLink(request: SetMeetingLinkRequest): void {
    const details = this.consultation();

    if (!details?.actions.canSetMeetingLink || this.submitting()) {
      return;
    }

    this.runMutation(
      'meeting',
      this.consultationService.setMeetingLink(
        this.consultationId,
        request
      ),
      'تم حفظ رابط الاستشارة بنجاح.'
    );
  }

  openAction(action: TeacherConsultationAction): void {
    const actions = this.consultation()?.actions;

    const allowed =
      action === 'reject'
        ? actions?.canReject
        : action === 'cancel'
          ? actions?.canCancel
          : actions?.canComplete;

    if (allowed && !this.submitting()) {
      this.actionModal.set(action);
    }
  }

  closeAction(): void {
    if (!this.submitting()) {
      this.actionModal.set(null);
    }
  }

  confirmAction(event: {
    action: TeacherConsultationAction;
    reason: string | null;
  }): void {
    const details = this.consultation();

    if (!details || this.submitting()) {
      return;
    }

    let request$: Observable<ConsultationDetails>;
    let successMessage: string;

    if (event.action === 'reject' && details.actions.canReject) {
      request$ = this.consultationService.rejectConsultation(
        this.consultationId,
        { reason: event.reason }
      );

      successMessage = 'تم رفض طلب الاستشارة.';
    } else if (event.action === 'cancel' && details.actions.canCancel) {
      request$ = this.consultationService.cancelConsultation(
        this.consultationId,
        { reason: event.reason }
      );

      successMessage =
        details.pointsPrice === 0
          ? 'تم إلغاء الاستشارة.'
          : 'تم إلغاء الاستشارة وإعادة النقاط للطالب.';
    } else if (
      event.action === 'complete' &&
      details.actions.canComplete
    ) {
      request$ = this.consultationService.completeConsultation(
        this.consultationId
      );

      successMessage =
        details.pointsPrice === 0
          ? 'تم إنهاء الاستشارة بنجاح.'
          : 'تم إنهاء الاستشارة بنجاح وإضافة نقاطها إلى رصيدك.';
    } else {
      return;
    }

    this.runMutation(
      event.action,
      request$,
      successMessage
    );
  }

  private runMutation(
    type: Submission,
    request$: Observable<ConsultationDetails>,
    successMessage: string
  ): void {
    this.submitting.set(type);
    this.actionError.set('');

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(null);
          this.actionModal.set(null);
          this.toast.show(successMessage);
          this.loadConsultation();
        },
        error: (error: HttpErrorResponse) => {
          this.submitting.set(null);
          this.handleMutationError(error, type);
        },
      });
  }

  private handleMutationError(
    error: HttpErrorResponse,
    type: Submission
  ): void {
    const failure = error.error as ConsultationApiFailure | null;
    let message: string;

    if (error.status === 409) {
      message =
        type === 'proposal'
          ? 'تغيرت بيانات الاستشارة أثناء تعديل المقترح. تم تحديث الصفحة؛ راجع البيانات ثم أعد إدخال التعديلات.'
          : 'تغيرت حالة الاستشارة أو بياناتها. تم تحديث الصفحة لعرض أحدث حالة.';

      this.actionModal.set(null);
      this.actionError.set(message);
      this.toast.show(message, 'error');
      this.loadConsultation(true);
      return;
    }

    if (error.status === 403) {
      message = 'لم يعد مسموحًا بتنفيذ هذا الإجراء على الاستشارة.';
    } else if (error.status === 404) {
      message = 'تعذر العثور على الاستشارة المطلوبة.';
    } else if (error.status === 400 && failure?.errorMessage) {
      message = failure.errorMessage;
    } else {
      message = 'تعذر تنفيذ الإجراء. تحقق من البيانات وحاول مرة أخرى.';
    }

    this.actionModal.set(null);
    this.actionError.set(message);
    this.toast.show(message, 'error');

    if (error.status === 403 || error.status === 404) {
      this.loadConsultation(true);
    }
  }

  private detailsErrorFor(
    error: HttpErrorResponse
  ): DetailsError {
    if (error.status === 403) {
      return {
        title: 'لا يمكنك الوصول إلى هذه الاستشارة',
        message: 'هذه الاستشارة غير متاحة لهذا الحساب.',
        retryable: false,
      };
    }

    if (error.status === 404) {
      return {
        title: 'الاستشارة غير موجودة',
        message:
          'تعذر العثور على الاستشارة المطلوبة أو لم تعد متاحة.',
        retryable: false,
      };
    }

    return {
      title: 'تعذر تحميل تفاصيل الاستشارة',
      message:
        'حدث خطأ أثناء الاتصال. تحقق من اتصالك ثم حاول مرة أخرى.',
      retryable: true,
    };
  }
}