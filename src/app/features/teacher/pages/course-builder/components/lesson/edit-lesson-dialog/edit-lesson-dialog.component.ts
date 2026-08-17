import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { LessonService } from '../../../../../services/lesson.service';
import { LessonModel } from '../../../../../models/lesson.model';

@Component({
  selector: 'app-edit-lesson-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-lesson-dialog.component.html',
  styleUrls: ['./edit-lesson-dialog.component.css'],
})
export class EditLessonDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private lessonService = inject(LessonService);

  @Input({ required: true })
  lesson!: LessonModel;

  @Input({ required: true })
  moduleId!: string;

  @Output()
  saved = new EventEmitter<void>();

  isSaving = signal(false);

  submitted = signal(false);

  errorMessage = signal('');

  lessonForm = this.fb.nonNullable.group({
    title: [
      '',
      [
        Validators.required,
        Validators.maxLength(200),
      ],
    ],

    orderIndex: [
      1,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],

    durationSeconds: [
      0,
      [
        Validators.required,
        Validators.min(0),
      ],
    ],

    contentType: [
      0,
      [
        Validators.required,
      ],
    ],
  });

  ngOnInit(): void {
    this.lessonForm.patchValue({
      title: this.lesson.title,
      orderIndex: this.lesson.orderIndex,
      durationSeconds: this.lesson.durationSeconds,
      contentType: this.lesson.contentType,
    });
  }

  get title() {
    return this.lessonForm.controls.title;
  }

  get orderIndex() {
    return this.lessonForm.controls.orderIndex;
  }

  get durationSeconds() {
    return this.lessonForm.controls.durationSeconds;
  }

  get contentType() {
    return this.lessonForm.controls.contentType;
  }

  hasError(control: AbstractControl): boolean {
    return control.invalid &&
      (control.touched || this.submitted());
  }

  save(): void {
    this.submitted.set(true);
    this.errorMessage.set('');

    this.lessonForm.markAllAsTouched();

    if (this.lessonForm.invalid) {
      return;
    }

    if (this.isSaving()) {
      return;
    }

    const formValue = this.lessonForm.getRawValue();

    const title = formValue.title.trim();

    if (!title) {
      this.title.setErrors({
        required: true,
      });

      this.title.markAsTouched();

      return;
    }

    this.isSaving.set(true);

    const body = {
      title,
      orderIndex: Number(formValue.orderIndex),
      contentType: Number(formValue.contentType),
      durationSeconds: Number(formValue.durationSeconds),
    };

    this.lessonService
      .update(
        this.moduleId,
        this.lesson.lessonID,
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
            'حدث خطأ أثناء تحديث الدرس. حاول مرة أخرى.'
          );
        },
      });
  }
}