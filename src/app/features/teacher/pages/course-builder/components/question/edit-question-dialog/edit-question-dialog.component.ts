import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../../../../services/question.service';
import { QuestionModel } from '../../../../../models/question.model';

@Component({
  selector: 'app-edit-question-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-question-dialog.component.html',
  styleUrls: ['./edit-question-dialog.component.css'],
})
export class EditQuestionDialogComponent {
  private questionService = inject(QuestionService);

  @Input({ required: true })
  question!: QuestionModel;

  @Output()
  saved = new EventEmitter<void>();

  text = '';
  questionType = 0;
  feedback = '';
  orderIndex = 1;

  validationMessage = '';

  ngOnInit(): void {
    this.text = this.question.text;
    this.questionType = this.question.questionType;
    this.feedback = this.question.feedback ?? '';
    this.orderIndex = this.question.orderIndex;
  }

  validate(): boolean {
    this.validationMessage = '';

    if (!this.text.trim()) {
      this.validationMessage = 'من فضلك اكتب نص السؤال.';
      return false;
    }

    if (this.text.trim().length < 5) {
      this.validationMessage = 'نص السؤال يجب أن يحتوي على 5 أحرف على الأقل.';
      return false;
    }

    if (
      this.questionType !== 0 &&
      this.questionType !== 1 &&
      this.questionType !== 2
    ) {
      this.validationMessage = 'من فضلك اختر نوع السؤال.';
      return false;
    }

    if (
      this.orderIndex === null ||
      this.orderIndex === undefined ||
      Number(this.orderIndex) < 1
    ) {
      this.validationMessage = 'ترتيب السؤال يجب أن يكون رقمًا أكبر من أو يساوي 1.';
      return false;
    }

    if (this.feedback.trim().length > 500) {
      this.validationMessage =
        'الملاحظات يجب ألا تتجاوز 500 حرف.';
      return false;
    }

    return true;
  }

  save(): void {
    if (!this.validate()) {
      return;
    }

    const body = {
      text: this.text.trim(),
      questionType: Number(this.questionType),
      feedback: this.feedback.trim(),
      orderIndex: Number(this.orderIndex),
    };

    this.questionService
      .update(this.question.questionID, body)
      .subscribe({
        next: () => {
          this.saved.emit();
        },
        error: (err) => {
          console.error('Failed to update question:', err);

          this.validationMessage =
            'حدث خطأ أثناء حفظ التعديلات. حاول مرة أخرى.';
        },
      });
  }
}