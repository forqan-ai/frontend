import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  afterNextRender,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../../core/services/toast.service';
import { ConsultationService } from '../../services/consultation.service';

const REQUEST_TEXT_MAX_LENGTH = 2000;

function nonWhitespace(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim().length > 0 ? null : { whitespace: true };
}

@Component({
  selector: 'app-book-consultation-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './book-consultation-modal.component.html',
  styleUrl: './book-consultation-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookConsultationModalComponent {
  private readonly consultationService = inject(ConsultationService);
  private readonly toast = inject(ToastService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly teacherId = input.required<string>();
  readonly teacherName = input.required<string>();

  readonly closed = output<void>();
  readonly created = output<void>();

  readonly isSubmitting = signal(false);
  readonly submitted = signal(false);
  readonly apiError = signal('');
  readonly requestTextMaxLength = REQUEST_TEXT_MAX_LENGTH;
  readonly requestTextArea = viewChild<ElementRef<HTMLTextAreaElement>>('requestTextArea');

  readonly consultationForm = this.formBuilder.nonNullable.group({
    requestText: [
      '',
      [
        Validators.required,
        nonWhitespace,
        Validators.maxLength(REQUEST_TEXT_MAX_LENGTH),
      ],
    ],
  });

  constructor() {
    afterNextRender(() => this.requestTextArea()?.nativeElement.focus());
  }

  get requestTextControl() {
    return this.consultationForm.controls.requestText;
  }

  get showRequestTextError(): boolean {
    return this.requestTextControl.invalid &&
      (this.requestTextControl.touched || this.submitted());
  }

  get requestTextErrorMessage(): string {
    if (this.requestTextControl.hasError('maxlength')) {
      return 'يجب ألا يتجاوز طلب الاستشارة 2000 حرف.';
    }

    return 'اكتب طلب الاستشارة قبل الإرسال.';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.requestClose();
  }

  requestClose(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.resetState();
    this.closed.emit();
  }

  submit(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.submitted.set(true);
    this.apiError.set('');

    const requestText = this.requestTextControl.value.trim();
    this.requestTextControl.setValue(requestText);
    this.requestTextControl.updateValueAndValidity();

    if (this.consultationForm.invalid) {
      this.consultationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.consultationService
      .createConsultation({
        teacherId: this.teacherId(),
        requestText,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.toast.show('تم إرسال طلب الاستشارة إلى المعلم بنجاح.');
          this.resetState();
          this.created.emit();
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          const message = this.errorMessageFor(error);
          this.apiError.set(message);
          this.toast.show(message, 'error');
        },
      });
  }

  private errorMessageFor(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400:
        return 'تعذر إرسال الطلب. تحقق من نص طلب الاستشارة ثم حاول مرة أخرى.';
      case 401:
        return 'انتهت جلسة تسجيل الدخول. سجّل الدخول مرة أخرى للمتابعة.';
      case 403:
        return 'حجز الاستشارة متاح لحسابات الطلاب النشطة فقط.';
      case 404:
        return 'تعذر العثور على المعلم المطلوب. حدّث الصفحة ثم حاول مرة أخرى.';
      case 409:
        return 'لديك بالفعل طلب استشارة قائم مع هذا المعلم.';
      default:
        return 'حدث خطأ أثناء إرسال طلب الاستشارة. حاول مرة أخرى.';
    }
  }

  private resetState(): void {
    this.consultationForm.reset();
    this.submitted.set(false);
    this.apiError.set('');
    this.isSubmitting.set(false);
  }
}
