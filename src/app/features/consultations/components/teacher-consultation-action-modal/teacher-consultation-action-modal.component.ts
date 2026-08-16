import { ChangeDetectionStrategy, Component, HostListener, computed, effect, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeacherConsultationAction } from '../../models/consultation.models';

@Component({
  selector: 'app-teacher-consultation-action-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './teacher-consultation-action-modal.component.html',
  styleUrl: './teacher-consultation-action-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherConsultationActionModalComponent {
  readonly action = input.required<TeacherConsultationAction>();
  readonly studentName = input.required<string>();
  readonly pointsPrice = input<number | null>(null);
  readonly cancelContext = input<'teacher-confirmed' | 'student-request'>('teacher-confirmed');
  readonly loading = input(false);
  readonly closed = output<void>();
  readonly confirmed = output<{ action: TeacherConsultationAction; reason: string | null }>();
  readonly reasonControl = new FormControl('', { nonNullable: true });
  readonly needsReason = computed(() => this.action() !== 'complete');
  readonly reasonMaxLength = computed(() => this.action() === 'cancel' ? 500 : 1000);
  readonly isStudentRequestCancel = computed(
    () => this.action() === 'cancel' && this.cancelContext() === 'student-request',
  );

  constructor() {
    effect(() => {
      this.reasonControl.setValidators([Validators.maxLength(this.reasonMaxLength())]);
      this.reasonControl.reset();
    });
  }

  title(): string {
    if (this.action() === 'reject') return 'رفض طلب الاستشارة';
    if (this.action() === 'cancel') {
      return this.isStudentRequestCancel() ? 'إلغاء طلب الاستشارة' : 'إلغاء الاستشارة المؤكدة';
    }
    return 'إنهاء الاستشارة';
  }

  icon(): string {
    return this.action() === 'complete' ? 'bi bi-check2-circle' : 'bi bi-exclamation-triangle';
  }

  confirmLabel(): string {
    if (this.action() === 'reject') return 'تأكيد الرفض';
    if (this.action() === 'cancel') return 'تأكيد الإلغاء';
    return 'تأكيد الإنهاء';
  }

  submit(): void {
    this.reasonControl.markAsTouched();
    if (this.reasonControl.invalid || this.loading()) return;
    const reason = this.needsReason() ? this.reasonControl.value.trim() || null : null;
    this.confirmed.emit({ action: this.action(), reason });
  }

  close(): void {
    if (!this.loading()) this.closed.emit();
  }

  @HostListener('document:keydown.escape') onEscape(): void { this.close(); }
}
