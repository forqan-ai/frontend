import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';

import { Router } from '@angular/router';

import { EditQuestionDialogComponent } from '../edit-question-dialog/edit-question-dialog.component';

import { QuestionModel } from '../../../../../models/question.model';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [EditQuestionDialogComponent],
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.css'],
})
export class QuestionCardComponent {
  private readonly router = inject(Router);

  @Input({ required: true })
  question!: QuestionModel;

  @Input({ required: true })
  quizId!: string;

  @Output()
  refresh = new EventEmitter<void>();

  @Output()
  delete = new EventEmitter<QuestionModel>();

  showEdit = signal(false);

  toggleEdit(): void {
    this.showEdit.update((value) => !value);
  }

  openDeleteConfirm(): void {
    this.delete.emit(this.question);
  }

  manageOptions(): void {
    this.router.navigate([
      '/teacher/question-builder',
      this.quizId,
      'question',
      this.question.questionID,
      'options',
    ]);
  }
}