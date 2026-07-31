import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { EditQuestionDialogComponent } from '../edit-question-dialog/edit-question-dialog.component';
import { QuestionModel } from '../../../../../models/question.model';
import { QuestionService } from '../../../../../services/question.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [EditQuestionDialogComponent],
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.css'],
})
export class QuestionCardComponent {
  @Input({ required: true })
  question!: QuestionModel;

  @Output()
  refresh = new EventEmitter<void>();
  private router = inject(Router);

  @Input({ required: true })
  quizId!: string;
  private questionService = inject(QuestionService);

  showEdit = signal(false);

  toggleEdit() {
    this.showEdit.update((v) => !v);
  }

  deleteQuestion() {
    if (!confirm('Delete this question?')) return;

    this.questionService.delete(this.question.questionID).subscribe({
      next: () => {
        this.refresh.emit();
      },
    });
  }

  manageOptions() {
    this.router.navigate([
      '/teacher/question-builder',
      this.quizId,
      'question',
      this.question.questionID,
      'options',
    ]);
  }
}
