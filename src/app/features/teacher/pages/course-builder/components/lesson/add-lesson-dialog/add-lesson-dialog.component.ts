import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { LessonService } from '../../../../../services/lesson.service';

@Component({
  selector: 'app-add-lesson-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-lesson-dialog.component.html',
  styleUrl: './add-lesson-dialog.component.css',
})
export class AddLessonDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly lessonService = inject(LessonService);

  @Input({ required: true })
  moduleId!: string;

  @Output()
  readonly saved = new EventEmitter<void>();

  readonly loading = signal(false);

  readonly errorMsg = signal<string | null>(null);

  readonly successMsg = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: [
      '',
      [
        Validators.required,
        Validators.maxLength(200),
      ],
    ],

    orderIndex: [
      1,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],

    durationSeconds: [
      0,
      [
        Validators.required,
        Validators.min(0),
      ],
    ],

    contentType: [
      0,
      Validators.required,
    ],
  });

  getControl(controlName: string) {
    return this.form.get(controlName);
  }

  isInvalid(controlName: string): boolean {
    const control = this.getControl(controlName);

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  isValid(controlName: string): boolean {
    const control = this.getControl(controlName);

    return !!(
      control &&
      control.valid &&
      (control.dirty || control.touched)
    );
  }

  clearError(): void {
    this.errorMsg.set(null);
  }

  clearSuccess(): void {
    this.successMsg.set(null);
  }

  resetForm(): void {
    this.form.reset({
      title: '',
      orderIndex: 1,
      durationSeconds: 0,
      contentType: 0,
    });

    this.clearError();
    this.clearSuccess();
  }

  save(): void {
    this.form.markAllAsTouched();

    this.clearError();
    this.clearSuccess();

    if (this.form.invalid) {
      this.errorMsg.set('يرجى مراجعة البيانات المطلوبة.');
      return;
    }

    const value = this.form.getRawValue();

    const title = value.title.trim();

    if (!title) {
      this.form.controls.title.setValue('');
      this.form.controls.title.markAsTouched();

      this.errorMsg.set('عنوان الدرس مطلوب.');

      return;
    }

    this.loading.set(true);

    const body = {
      title,
      orderIndex: Number(value.orderIndex),
      durationSeconds: Number(value.durationSeconds),
      contentType: Number(value.contentType),
    };

    this.lessonService.create(this.moduleId, body).subscribe({
      next: () => {
        this.loading.set(false);

        this.successMsg.set('تمت إضافة الدرس بنجاح.');

        this.form.reset({
          title: '',
          orderIndex: 1,
          durationSeconds: 0,
          contentType: 0,
        });

        this.saved.emit();
      },

      error: (err) => {
        this.loading.set(false);

        this.errorMsg.set(
          err?.error?.message ||
          err?.error?.errorMessage ||
          err?.error ||
          'حدث خطأ أثناء إضافة الدرس.'
        );
      },
    });
  }
}