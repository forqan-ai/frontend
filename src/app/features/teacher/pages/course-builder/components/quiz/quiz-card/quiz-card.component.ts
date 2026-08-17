import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';

import { EditQuizDialogComponent } from '../edit-quiz-dialog/edit-quiz-dialog.component';

import { QuizModel } from '../../../../../models/quiz.model';

import { QuizService } from '../../../../../services/quiz.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-card',
  standalone: true,
  imports: [
    EditQuizDialogComponent,
  ],
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

  showDeleteConfirm = signal(false);

  isDeleting = signal(false);

  toggleEdit(): void {
    this.showEdit.update((value) => !value);
  }

  openDeleteConfirm(): void {
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm(): void {
    if (this.isDeleting()) {
      return;
    }

    this.showDeleteConfirm.set(false);
  }

  deleteQuiz(): void {
    if (this.isDeleting()) {
      return;
    }

    this.isDeleting.set(true);

    this.quizService
      .delete(
        this.moduleId,
        this.quiz.quizID
      )
      .subscribe({
        next: () => {
          this.isDeleting.set(false);
          this.showDeleteConfirm.set(false);
          this.refresh.emit();
        },
        error: (err) => {
          console.error(err);
          this.isDeleting.set(false);
        },
      });
  }

  manageQuestions(): void {
    this.router.navigate([
      '/teacher/quiz-builder',
      this.quiz.quizID,
    ]);
  }
}