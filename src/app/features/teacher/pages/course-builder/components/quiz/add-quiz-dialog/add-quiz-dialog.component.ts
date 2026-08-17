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

import { QuizService } from '../../../../../services/quiz.service';

@Component({
  selector: 'app-add-quiz-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-quiz-dialog.component.html',
  styleUrl: './add-quiz-dialog.component.css',
})
export class AddQuizDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly quizService = inject(QuizService);

  @Input({ required: true })
  moduleId!: string;

  @Output()
  saved = new EventEmitter<void>();

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

    type: [
      0,
      Validators.required,
    ],

    timeLimitMin: [
      20,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],

    passingScore: [
      70,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ],
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

  save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.errorMsg.set('يرجى مراجعة البيانات المطلوبة.');
      return;
    }

    this.loading.set(true);

    this.errorMsg.set(null);
    this.successMsg.set(null);

    const value = this.form.getRawValue();

    const body = {
      title: value.title.trim(),
      type: Number(value.type),
      timeLimitMin: Number(value.timeLimitMin),
      passingScore: Number(value.passingScore),
    };

    this.quizService.create(this.moduleId, body).subscribe({
      next: () => {
        this.loading.set(false);

        this.successMsg.set(
          'تمت إضافة الاختبار بنجاح.'
        );

        this.form.reset({
          title: '',
          type: 0,
          timeLimitMin: 20,
          passingScore: 70,
        });

        this.saved.emit();
      },

      error: (err) => {
        this.loading.set(false);

        this.errorMsg.set(
          err?.error?.message ||
          err?.error ||
          'حدث خطأ أثناء إضافة الاختبار.'
        );
      },
    });
  }
}