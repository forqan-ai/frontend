import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { LessonService } from '../../../../../services/lesson.service';

@Component({
  selector: 'app-add-lesson-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-lesson-dialog.component.html',
})
export class AddLessonDialogComponent {
  private lessonService = inject(LessonService);

  @Input({ required: true })
  moduleId!: string;

  @Output()
  saved = new EventEmitter<void>();

  title = '';

  orderIndex = 1;

  durationSeconds = 0;

  contentType = 0;

  save() {
    const body = {
      title: this.title,

      orderIndex: this.orderIndex,

      durationSeconds: this.durationSeconds,

      contentType: Number(this.contentType),
    };

    this.lessonService.create(this.moduleId, body).subscribe({
      next: () => {
        this.saved.emit();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }
}
