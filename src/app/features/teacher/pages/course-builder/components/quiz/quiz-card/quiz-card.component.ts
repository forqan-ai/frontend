import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';

import { EditQuizDialogComponent } from '../edit-quiz-dialog/edit-quiz-dialog.component';
import { QuizModel } from '../../../../../models/quiz.model';
import { QuizService } from '../../../../../services/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-card',
  standalone: true,
  imports: [EditQuizDialogComponent],
  templateUrl: './quiz-card.component.html',
  styleUrls: ['./quiz-card.component.css'],
})
export class QuizCardComponent {
  private quizService = inject(QuizService);
  private router = inject(Router);
  @Input({ required: true })
  quiz!: QuizModel;

  @Input({ required: true })
  moduleId!: string;

  @Output()
  refresh = new EventEmitter<void>();

  showEdit = signal(false);

  toggleEdit() {
    this.showEdit.update((v) => !v);
  }

  deleteQuiz() {
    if (!confirm('Delete Quiz ?')) return;

    this.quizService.delete(this.moduleId, this.quiz.quizID).subscribe({
      next: () => this.refresh.emit(),
    });
  }

  manageQuestions() {
    this.router.navigate(['/teacher/quiz-builder', this.quiz.quizID]);
  }
}
