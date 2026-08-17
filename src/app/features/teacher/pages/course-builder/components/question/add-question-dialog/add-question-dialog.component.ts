import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { QuestionService } from '../../../../../services/question.service';

@Component({
  selector: 'app-add-question-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-question-dialog.component.html',
  styleUrls: ['./add-question-dialog.component.css']
})
export class AddQuestionDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly questionService = inject(QuestionService);

  @Input({ required: true })
  quizId!: string;

  @Output()
  saved = new EventEmitter<void>();

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly successMsg = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    text: [
      '',
      [
        Validators.required,
        Validators.maxLength(1000)
      ]
    ],

    questionType: [
      0,
      Validators.required
    ],

    feedback: [
      ''
    ],

    orderIndex: [
      1,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(1000)
      ]
    ]
  });

  get textControl() {
    return this.form.controls.text;
  }

  get questionTypeControl() {
    return this.form.controls.questionType;
  }

  get feedbackControl() {
    return this.form.controls.feedback;
  }

  get orderIndexControl() {
    return this.form.controls.orderIndex;
  }

  isInvalid(
    controlName:
      | 'text'
      | 'questionType'
      | 'feedback'
      | 'orderIndex'
  ): boolean {
    const control = this.form.controls[controlName];

    return control.invalid &&
      (control.dirty || control.touched);
  }

  isValid(
    controlName:
      | 'text'
      | 'questionType'
      | 'feedback'
      | 'orderIndex'
  ): boolean {
    const control = this.form.controls[controlName];

    return control.valid &&
      (control.dirty || control.touched);
  }

  submit(): void {
    this.errorMsg.set(null);
    this.successMsg.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const body = {
      text: this.textControl.value.trim(),
      questionType: this.questionTypeControl.value,
      feedback: this.feedbackControl.value.trim() || null,
      orderIndex: this.orderIndexControl.value
    };

    this.questionService
      .create(this.quizId, body)
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.successMsg.set(
            'تمت إضافة السؤال بنجاح.'
          );

          setTimeout(() => {
            this.saved.emit();
            this.resetForm();
          }, 700);
        },

        error: (error) => {
          this.loading.set(false);

          this.errorMsg.set(
            error?.error?.errorMessage ||
            error?.error?.message ||
            error?.error ||
            'حدث خطأ أثناء إضافة السؤال.'
          );
        }
      });
  }

  resetForm(): void {
    this.form.reset({
      text: '',
      questionType: 0,
      feedback: '',
      orderIndex: 1
    });
  }

  clearError(): void {
    this.errorMsg.set(null);
  }

  clearSuccess(): void {
    this.successMsg.set(null);
  }
}