import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';

import { LessonModel } from '../../../../../models/lesson.model';
import { EditLessonDialogComponent } from '../edit-lesson-dialog/edit-lesson-dialog.component';
import { LessonService } from '../../../../../services/lesson.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lesson-card',
  standalone: true,
  imports: [EditLessonDialogComponent],
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

  toggleEdit() {
    this.showEdit.update((v) => !v);
  }

  deleteLesson() {
    const confirmDelete = confirm('Are you sure you want to delete this lesson?');

    if (!confirmDelete) return;

    this.lessonService.delete(this.moduleId, this.lesson.lessonID).subscribe({
      next: () => {
        this.refresh.emit();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  manageContent() {
    this.router.navigate(['/teacher/lesson-content', this.moduleId, this.lesson.lessonID]);
  }
}
