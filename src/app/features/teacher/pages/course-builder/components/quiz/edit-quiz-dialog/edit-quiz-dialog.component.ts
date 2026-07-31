import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { QuizModel } from '../../../../../models/quiz.model';
import { QuizService } from '../../../../../services/quiz.service';


@Component({
  selector: 'app-edit-quiz-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-quiz-dialog.component.html',
})
export class EditQuizDialogComponent {
  private quizService = inject(QuizService);


  @Input({ required: true })
  quiz!: QuizModel;

  @Input({ required: true })
  moduleId!: string;

  @Output()
  saved = new EventEmitter<void>();

  title = '';
  type = 0;
  timeLimitMin = 20;
  passingScore = 70;

  ngOnInit() {
    this.title = this.quiz.title;
    this.type = this.quiz.type;
    this.timeLimitMin = this.quiz.timeLimitMin;
    this.passingScore = this.quiz.passingScore;
  }

  save() {
    const body = {
      title: this.title,
      type: Number(this.type),
      timeLimitMin: Number(this.timeLimitMin),
      passingScore: Number(this.passingScore),
    };

    this.quizService
      .update(this.moduleId, this.quiz.quizID, body)
      .subscribe({
        next: () => this.saved.emit(),
      });
  }
}