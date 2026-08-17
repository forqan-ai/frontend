import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

import { LessonModel } from '../../../../../models/lesson.model';
import { EditLessonDialogComponent } from '../edit-lesson-dialog/edit-lesson-dialog.component';
import { LessonService } from '../../../../../services/lesson.service';

@Component({
  selector: 'app-lesson-card',
  standalone: true,
  imports: [
    DecimalPipe,
    EditLessonDialogComponent,
  ],
  templateUrl: './lesson-card.component.html',
  styleUrls: ['./lesson-card.component.css'],
})
export class LessonCardComponent {
  private router = inject(Router);
  private lessonService = inject(LessonService);

  @Input({ required: true })
  lesson!: LessonModel;

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

  deleteLesson(): void {
    if (this.isDeleting()) {
      return;
    }

    this.isDeleting.set(true);

    this.lessonService
      .delete(
        this.moduleId,
        this.lesson.lessonID
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

  manageContent(): void {
    this.router.navigate([
      '/teacher/lesson-content',
      this.moduleId,
      this.lesson.lessonID,
    ]);
  }
}