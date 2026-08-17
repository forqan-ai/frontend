import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { QuestionService } from '../../services/question.service';
import { QuestionModel } from '../../models/question.model';

import { AddQuestionDialogComponent } from '../course-builder/components/question/add-question-dialog/add-question-dialog.component';
import { QuestionCardComponent } from '../course-builder/components/question/question-card/question-card.component';

@Component({
  selector: 'app-question-builder',
  standalone: true,
  imports: [
    AddQuestionDialogComponent,
    QuestionCardComponent,
  ],
  templateUrl: './question-builder.component.html',
  styleUrls: ['./question-builder.component.css'],
})
export class QuestionBuilderComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly questionService = inject(QuestionService);

  quizId = '';

  questions = signal<QuestionModel[]>([]);
  showAddQuestion = signal(false);

  showDeleteConfirm = signal(false);
  selectedQuestion = signal<QuestionModel | null>(null);
  isDeleting = signal(false);

  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.quizId =
      this.route.snapshot.paramMap.get('quizId') ?? '';

    this.loadQuestions();
  }

  loadQuestions(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.questionService
      .getQuestions(this.quizId)
      .subscribe({
        next: (res) => {
          this.questions.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);

          this.questions.set([]);
          this.isLoading.set(false);

          this.errorMessage.set(
            'حدث خطأ أثناء تحميل الأسئلة. حاول مرة أخرى.'
          );
        },
      });
  }

  toggleAddQuestion(): void {
    this.showAddQuestion.update((value) => !value);
  }

  openDeleteConfirm(question: QuestionModel): void {
    if (this.isDeleting()) {
      return;
    }

    this.selectedQuestion.set(question);
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm(): void {
    if (this.isDeleting()) {
      return;
    }

    this.showDeleteConfirm.set(false);
    this.selectedQuestion.set(null);
  }

  deleteQuestion(): void {
    const question = this.selectedQuestion();

    if (!question || this.isDeleting()) {
      return;
    }

    this.isDeleting.set(true);

    this.questionService
      .delete(question.questionID)
      .subscribe({
        next: () => {
          this.isDeleting.set(false);
          this.showDeleteConfirm.set(false);
          this.selectedQuestion.set(null);

          this.loadQuestions();
        },
        error: (error) => {
          console.error(
            'Failed to delete question:',
            error
          );

          this.isDeleting.set(false);
        },
      });
  }
}