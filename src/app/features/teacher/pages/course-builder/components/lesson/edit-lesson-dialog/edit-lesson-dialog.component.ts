import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { LessonService } from '../../../../../services/lesson.service';
import { LessonModel } from '../../../../../models/lesson.model';

@Component({
  selector: 'app-edit-lesson-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-lesson-dialog.component.html',
})
export class EditLessonDialogComponent {
  private lessonService = inject(LessonService);

  @Input({ required: true })
  lesson!: LessonModel;

  @Input({ required: true })
  moduleId!: string;

  @Output()
  saved = new EventEmitter<void>();

  title = '';

  orderIndex = 1;

  durationSeconds = 0;

  contentType = 0;

  ngOnInit() {
    this.title = this.lesson.title;

    this.orderIndex = this.lesson.orderIndex;

    this.durationSeconds = this.lesson.durationSeconds;

    this.contentType = this.lesson.contentType;
  }

  save() {
    const body = {
      title: this.title,

      orderIndex: this.orderIndex,

      durationSeconds: this.durationSeconds,

      contentType: Number(this.contentType),
    };

    this.lessonService.update(this.moduleId, this.lesson.lessonID, body).subscribe({
      next: () => {
        this.saved.emit();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }
}
