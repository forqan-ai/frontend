import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { QuestionModel } from '../../models/question.model';
import { AddQuestionDialogComponent } from '../course-builder/components/question/add-question-dialog/add-question-dialog.component';
import { QuestionCardComponent } from '../course-builder/components/question/question-card/question-card.component';

@Component({
  selector: 'app-question-builder',
  standalone: true,
  imports: [AddQuestionDialogComponent, QuestionCardComponent],
  templateUrl: './question-builder.component.html',
  styleUrls: ['./question-builder.component.css'],
})
export class QuestionBuilderComponent {
  private route = inject(ActivatedRoute);

  private questionService = inject(QuestionService);

  quizId = '';

  questions = signal<QuestionModel[]>([]);

  showAddQuestion = signal(false);

  ngOnInit() {
    this.quizId = this.route.snapshot.paramMap.get('quizId')!;

    this.loadQuestions();
  }

  loadQuestions() {
    this.questionService.getQuestions(this.quizId).subscribe({
      next: (res) => {
        console.log('Questions =', res);
        this.questions.set(res);
      },
      error: (err) => console.error(err),
    });
  }

  toggleAddQuestion() {
    this.showAddQuestion.update((v) => !v);
  }
}
