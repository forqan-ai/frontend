import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { QuizService } from '../../../../../services/quiz.service';



@Component({
  selector: 'app-add-quiz-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-quiz-dialog.component.html',
})
export class AddQuizDialogComponent {
  private quizService = inject(QuizService);

  @Input({ required: true })
  moduleId!: string;

  @Output()
  saved = new EventEmitter<void>();

  title = '';

  type = 0;

  timeLimitMin = 20;

  passingScore = 70;

  save() {
    const body = {
      title: this.title,
      type: Number(this.type),
      timeLimitMin: Number(this.timeLimitMin),
      passingScore: Number(this.passingScore),
    };

    this.quizService.create(this.moduleId, body).subscribe({
      next: () => {
        this.saved.emit();

        this.title = '';
        this.type = 0;
        this.timeLimitMin = 20;
        this.passingScore = 70;
      },
      error: (err) => console.log(err),
    });
  }
}