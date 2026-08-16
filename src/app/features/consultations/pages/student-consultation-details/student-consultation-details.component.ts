import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Role } from '../../../../core/models/auth.models';
import { NotificationRealtimeService } from '../../../../core/services/notification-realtime.service';
import { AcceptConsultationConfirmationModalComponent } from '../../components/accept-consultation-confirmation-modal/accept-consultation-confirmation-modal.component';
import { TeacherConsultationActionModalComponent } from '../../components/teacher-consultation-action-modal/teacher-consultation-action-modal.component';
import {
  ConsultationApiFailure,
  ConsultationDetails,
  ConsultationSlot,
  consultationStatusClass,
  consultationStatusLabel,
  formatConsultationDate,
} from '../../models/consultation.models';
import { ConsultationService } from '../../services/consultation.service';

interface DetailsError {
  title: string;
  message: string;
  retryable: boolean;
}

@Component({
  selector: 'app-student-consultation-details',
  imports: [RouterLink, AcceptConsultationConfirmationModalComponent, TeacherConsultationActionModalComponent],
  templateUrl: './student-consultation-details.component.html',
  styleUrl: './student-consultation-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentConsultationDetailsComponent implements OnInit {
  private readonly consultationService = inject(ConsultationService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly notificationRealtime = inject(NotificationRealtimeService);
  private readonly destroyRef = inject(DestroyRef);

  readonly consultation = signal<ConsultationDetails | null>(null);
  readonly loading = signal(false);
  readonly loadError = signal<DetailsError | null>(null);
  readonly selectedSlotId = signal<string | null>(null);
  readonly confirmationOpen = signal(false);
  readonly accepting = signal(false);
  readonly cancelConfirmationOpen = signal(false);
  readonly cancelling = signal(false);
  readonly acceptError = signal('');
  readonly actionBusy = computed(() => this.accepting() || this.cancelling());
  readonly isStudentActor = computed(() => this.authService.hasRole(Role.Student));

  readonly selectedSlot = computed<ConsultationSlot | null>(() => {
    const consultation = this.consultation();
    const slotId = this.selectedSlotId();
    return consultation?.slots.find((slot) => slot.slotId === slotId) ?? null;
  });

  readonly availableSlots = computed<ConsultationSlot[]>(() => {
    const consultation = this.consultation();
    if (!consultation) {
      return [];
    }

    const serverNow = new Date(consultation.serverNowUtc).getTime();
    return consultation.slots.filter(
      (slot) => new Date(slot.startTime).getTime() > serverNow,
    );
  });

  readonly statusLabel = consultationStatusLabel;
  readonly statusClass = consultationStatusClass;
  readonly formatDate = formatConsultationDate;

  private consultationId = '';

  ngOnInit(): void {
    this.consultationId = this.route.snapshot.paramMap.get('consultationId') ?? '';

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
          notification.referenceId?.toLowerCase() === this.consultationId.toLowerCase()
        ) {
          this.loadConsultation();
        }
      });
  }

  loadConsultation(preserveAcceptError = false): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.confirmationOpen.set(false);
    this.cancelConfirmationOpen.set(false);
    this.selectedSlotId.set(null);

    if (!preserveAcceptError) {
      this.acceptError.set('');
    }

    this.consultationService
      .getConsultationById(this.consultationId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (consultation) => this.consultation.set(consultation),
        error: (error: HttpErrorResponse) => {
          this.consultation.set(null);
          this.loadError.set(this.detailsErrorFor(error));
        },
      });
  }

  selectSlot(slotId: string): void {
    const consultation = this.consultation();
    if (!this.actionBusy() && consultation?.actions.canAccept) {
      this.selectedSlotId.set(slotId);
      this.acceptError.set('');
    }
  }

  openConfirmation(): void {
    const consultation = this.consultation();
    if (
      consultation?.actions.canAccept &&
      this.selectedSlot() &&
      !this.actionBusy()
    ) {
      this.confirmationOpen.set(true);
    }
  }

  closeConfirmation(): void {
    if (!this.accepting()) {
      this.confirmationOpen.set(false);
    }
  }

  openCancelConfirmation(): void {
    const consultation = this.consultation();
    if (this.isStudentActor() && consultation?.actions.canCancel && !this.actionBusy()) {
      this.cancelConfirmationOpen.set(true);
    }
  }

  closeCancelConfirmation(): void {
    if (!this.cancelling()) {
      this.cancelConfirmationOpen.set(false);
    }
  }

  cancelConsultation(event: { reason: string | null }): void {
    const consultation = this.consultation();
    if (!this.isStudentActor() || !consultation?.actions.canCancel || this.actionBusy()) {
      return;
    }

    this.cancelling.set(true);
    this.acceptError.set('');
    this.consultationService
      .cancelConsultation(this.consultationId, { reason: event.reason })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.cancelling.set(false);
          this.cancelConfirmationOpen.set(false);
          this.selectedSlotId.set(null);
          this.toast.show('تم إلغاء طلب الاستشارة بنجاح.');
          this.loadConsultation();
        },
        error: (error: HttpErrorResponse) => {
          this.cancelling.set(false);
          this.handleCancelError(error);
        },
      });
  }

  acceptConsultation(): void {
    const consultation = this.consultation();
    const selectedSlotId = this.selectedSlotId();

    if (
      !consultation ||
      !consultation.actions.canAccept ||
      !selectedSlotId ||
      this.accepting()
    ) {
      return;
    }

    this.accepting.set(true);
    this.acceptError.set('');

    this.consultationService
      .acceptConsultation(this.consultationId, {
        selectedSlotId,
        rowVersion: consultation.rowVersion,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.accepting.set(false);
          this.confirmationOpen.set(false);
          this.selectedSlotId.set(null);
          this.toast.show('تم تأكيد موعد الاستشارة بنجاح.');
          this.loadConsultation();
        },
        error: (error: HttpErrorResponse) => {
          this.accepting.set(false);
          this.handleAcceptError(error);
        },
      });
  }

  private handleAcceptError(error: HttpErrorResponse): void {
    const failure = error.error as ConsultationApiFailure | null;

    if (error.status === 409 && failure?.errorCode === 'InsufficientPoints') {
      const message = 'رصيد نقاطك غير كافٍ لتأكيد هذه الاستشارة.';
      this.confirmationOpen.set(false);
      this.acceptError.set(message);
      this.toast.show(message, 'error');
      return;
    }

    if (error.status === 409) {
      const message = 'تعذر تأكيد الموعد لأن بيانات الاستشارة تغيرت. تم تحديث البيانات، يرجى المحاولة مرة أخرى.';
      this.confirmationOpen.set(false);
      this.selectedSlotId.set(null);
      this.acceptError.set(message);
      this.toast.show(message, 'error');
      this.loadConsultation(true);
      return;
    }

    if (error.status === 400) {
      const message = 'تعذر تأكيد الموعد المحدد. تم تحديث بيانات الاستشارة، اختر موعدًا متاحًا وحاول مرة أخرى.';
      this.confirmationOpen.set(false);
      this.acceptError.set(message);
      this.toast.show(message, 'error');
      this.loadConsultation(true);
      return;
    }

    const message = error.status === 403
      ? 'لم يعد مسموحًا بتأكيد هذه الاستشارة.'
      : error.status === 404
        ? 'تعذر العثور على الاستشارة المطلوبة.'
        : 'حدث خطأ أثناء تأكيد الاستشارة. حاول مرة أخرى.';

    this.confirmationOpen.set(false);
    this.acceptError.set(message);
    this.toast.show(message, 'error');

    if (error.status === 403 || error.status === 404) {
      this.loadConsultation(true);
    }
  }

  private handleCancelError(error: HttpErrorResponse): void {
    let message: string;
    if (error.status === 409) {
      message = 'تعذر إلغاء الطلب لأن حالة الاستشارة تغيرت. تم تحديث البيانات.';
      this.cancelConfirmationOpen.set(false);
      this.selectedSlotId.set(null);
      this.acceptError.set(message);
      this.toast.show(message, 'error');
      this.loadConsultation(true);
      return;
    }

    if (error.status === 403) message = 'لم يعد مسموحًا بإلغاء طلب الاستشارة.';
    else if (error.status === 404) message = 'تعذر العثور على الاستشارة المطلوبة.';
    else if (error.status === 400) message = 'تعذر إلغاء الطلب في حالته الحالية. تم تحديث بيانات الاستشارة.';
    else message = 'حدث خطأ أثناء إلغاء طلب الاستشارة. حاول مرة أخرى.';

    this.cancelConfirmationOpen.set(false);
    this.acceptError.set(message);
    this.toast.show(message, 'error');
    if (error.status === 400 || error.status === 403 || error.status === 404) {
      this.loadConsultation(true);
    }
  }

  private detailsErrorFor(error: HttpErrorResponse): DetailsError {
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
        message: 'تعذر العثور على الاستشارة المطلوبة أو لم تعد متاحة.',
        retryable: false,
      };
    }

    return {
      title: 'تعذر تحميل تفاصيل الاستشارة',
      message: 'حدث خطأ أثناء الاتصال. تحقق من اتصالك ثم حاول مرة أخرى.',
      retryable: true,
    };
  }
}
