import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../../../../services/question.service';
import { QuestionModel } from '../../../../../models/question.model';


@Component({
  selector: 'app-edit-question-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-question-dialog.component.html',
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

  ngOnInit() {
    this.text = this.question.text;

    this.questionType = this.question.questionType;

    this.feedback = this.question.feedback ?? '';

    this.orderIndex = this.question.orderIndex;
  }

  save() {
    const body = {
      text: this.text,

      questionType: this.questionType,

      feedback: this.feedback,

      orderIndex: this.orderIndex,
    };

    this.questionService.update(this.question.questionID, body).subscribe({
      next: () => {
        this.saved.emit();
      },
    });
  }
}
