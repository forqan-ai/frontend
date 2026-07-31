import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../../../../services/question.service';

@Component({
  selector: 'app-add-question-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-question-dialog.component.html',
})
export class AddQuestionDialogComponent {
  private questionService = inject(QuestionService);

  @Input({ required: true })
  quizId!: string;

  @Output()
  saved = new EventEmitter<void>();

  text = '';

  questionType = 0;

  feedback = '';

  orderIndex = 1;

  save() {
    const body = {
      text: this.text,

      questionType: this.questionType,

      feedback: this.feedback,

      orderIndex: this.orderIndex,
    };

    this.questionService.create(this.quizId, body).subscribe({
      next: () => {
        this.saved.emit();
      },
    });
  }
}
