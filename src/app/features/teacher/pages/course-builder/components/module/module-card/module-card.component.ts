import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  signal,
} from '@angular/core';

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
export class ModuleCardComponent implements OnInit, OnDestroy {
  private readonly moduleService = inject(ModuleService);
  private readonly lessonService = inject(LessonService);
  private readonly quizService = inject(QuizService);

  @Input({ required: true })
  module!: ModuleModel;

  @Input({ required: true })
  courseId!: string;

  @Output()
  refresh = new EventEmitter<void>();

  @ViewChild('quizArea')
  quizArea?: ElementRef<HTMLElement>;

  lessons = signal<LessonModel[]>([]);

  quiz = signal<QuizModel | null>(null);

  showAddLesson = signal(false);

  showEdit = signal(false);

  showAddQuiz = signal(false);

  showDeleteConfirm = signal(false);

  isDeleting = signal(false);

  ngOnInit(): void {
    this.loadLessons();
    this.loadQuiz();
  }

  loadLessons(): void {
    this.lessonService
      .getLessons(this.module.moduleID)
      .subscribe({
        next: (res) => {
          this.lessons.set(res);
        },
        error: (err) => {
          console.error(err);
          this.lessons.set([]);
        },
      });
  }

  loadQuiz(): void {
    this.quizService
      .getQuiz(this.module.moduleID)
      .subscribe({
        next: (res) => {
          this.quiz.set(res);
        },
        error: () => {
          this.quiz.set(null);
        },
      });
  }

  toggleAddLesson(): void {
    this.showAddLesson.update((value) => !value);
  }

  toggleEdit(): void {
    this.showEdit.update((value) => !value);
  }

  toggleAddQuiz(): void {
    const willOpen = !this.showAddQuiz();

    this.showAddQuiz.set(willOpen);

    if (willOpen) {
      setTimeout(() => {
        this.scrollToQuiz();
      });
    }
  }

  private scrollToQuiz(): void {
    const element = this.quizArea?.nativeElement;

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
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

  deleteModule(): void {
    if (this.isDeleting()) {
      return;
    }

    this.isDeleting.set(true);

    this.moduleService
      .delete(
        this.courseId,
        this.module.moduleID
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

  ngOnDestroy(): void {
   
  }
}

