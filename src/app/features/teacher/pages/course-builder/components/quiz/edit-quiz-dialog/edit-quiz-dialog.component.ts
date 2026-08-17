import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { QuizModel } from '../../../../../models/quiz.model';
import { QuizService } from '../../../../../services/quiz.service';

@Component({
  selector: 'app-edit-quiz-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-quiz-dialog.component.html',
  styleUrls: ['./edit-quiz-dialog.component.css'],
})
export class EditQuizDialogComponent implements OnInit {
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

  isSaving = signal(false);
  submitted = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.title = this.quiz.title;
    this.type = this.quiz.type;
    this.timeLimitMin = this.quiz.timeLimitMin;
    this.passingScore = this.quiz.passingScore;
  }

  get isTitleInvalid(): boolean {
    return (
      this.submitted() &&
      !this.title.trim()
    );
  }

  get isTimeInvalid(): boolean {
    return (
      this.submitted() &&
      (
        this.timeLimitMin === null ||
        this.timeLimitMin === undefined ||
        Number(this.timeLimitMin) < 1
      )
    );
  }

  get isPassingInvalid(): boolean {
    return (
      this.submitted() &&
      (
        this.passingScore === null ||
        this.passingScore === undefined ||
        Number(this.passingScore) < 0 ||
        Number(this.passingScore) > 100
      )
    );
  }

  save(): void {
    this.submitted.set(true);
    this.errorMessage.set('');

    const title = this.title.trim();
    const timeLimit = Number(this.timeLimitMin);
    const passingScore = Number(this.passingScore);

    if (!title) {
      this.errorMessage.set('يرجى إدخال عنوان الاختبار.');
      return;
    }

    if (title.length > 200) {
      this.errorMessage.set(
        'عنوان الاختبار يجب ألا يتجاوز 200 حرف.'
      );
      return;
    }

    if (!Number.isFinite(timeLimit) || timeLimit < 1) {
      this.errorMessage.set(
        'مدة الاختبار يجب أن تكون دقيقة واحدة على الأقل.'
      );
      return;
    }

    if (
      !Number.isFinite(passingScore) ||
      passingScore < 0 ||
      passingScore > 100
    ) {
      this.errorMessage.set(
        'درجة النجاح يجب أن تكون بين 0 و100.'
      );
      return;
    }

    if (this.isSaving()) {
      return;
    }

    this.isSaving.set(true);

    const body = {
      title,
      type: Number(this.type),
      timeLimitMin: timeLimit,
      passingScore,
    };

    this.quizService
      .update(
        this.moduleId,
        this.quiz.quizID,
        body
      )
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.saved.emit();
        },

        error: (err) => {
          console.error(err);

          this.isSaving.set(false);

          this.errorMessage.set(
            'حدث خطأ أثناء تحديث الاختبار. حاول مرة أخرى.'
          );
        },
      });
  }
}