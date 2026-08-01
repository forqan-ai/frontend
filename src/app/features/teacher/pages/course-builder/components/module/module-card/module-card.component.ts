import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { ModuleModel } from '../../../../../models/module.model';
import { EditModuleDialogComponent } from '../edit-module-dialog/edit-module-dialog.component';
import { ModuleService } from '../../../../../services/module.service';
import { LessonCardComponent } from '../../lesson/lesson-card/lesson-card.component';
import { AddLessonDialogComponent } from '../../lesson/add-lesson-dialog/add-lesson-dialog.component';
import { LessonService } from '../../../../../services/lesson.service';
import { LessonModel } from '../../../../../models/lesson.model';
import { QuizService } from '../../../../../services/quiz.service';
import { QuizModel } from '../../../../../models/quiz.model';
import { AddQuizDialogComponent } from '../../quiz/add-quiz-dialog/add-quiz-dialog.component';
import { QuizCardComponent } from '../../quiz/quiz-card/quiz-card.component';

@Component({
  selector: 'app-module-card',
  standalone: true,
  imports: [
    EditModuleDialogComponent,
    LessonCardComponent,
    AddLessonDialogComponent,
    AddQuizDialogComponent,
    QuizCardComponent,
  ],
  templateUrl: './module-card.component.html',
  styleUrls: ['./module-card.component.css'],
})
export class ModuleCardComponent {
  private moduleService = inject(ModuleService);
  @Input({ required: true })
  module!: ModuleModel;

  @Input({ required: true })
  courseId!: string;

  @Output()
  refresh = new EventEmitter<void>();
  private lessonService = inject(LessonService);
  private quizService = inject(QuizService);

  lessons = signal<LessonModel[]>([]);
  quiz = signal<QuizModel | null>(null);
  showAddLesson = signal(false);
  showEdit = signal(false);
  showAddQuiz = signal(false);

  ngOnInit() {
    this.loadLessons();
    this.loadQuiz();
  }

  loadLessons() {
    this.lessonService.getLessons(this.module.moduleID).subscribe({
      next: (res) => {
        this.lessons.set(res);
      },
    });
  }

  toggleAddLesson() {
    this.showAddLesson.update((v) => !v);
  }
  toggleEdit() {
    this.showEdit.update((v) => !v);
  }
  loadQuiz() {
    this.quizService.getQuiz(this.module.moduleID).subscribe({
      next: (res) => {
        this.quiz.set(res);
      },
      error: () => {
        this.quiz.set(null);
      },
    });
  }

  toggleAddQuiz() {
    this.showAddQuiz.update((v) => !v);
  }
  deleteModule() {
    const confirmed = confirm(`Delete "${this.module.title}" ?`);

    if (!confirmed) return;

    this.moduleService.delete(this.courseId, this.module.moduleID).subscribe({
      next: () => {
        this.refresh.emit();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }
}
