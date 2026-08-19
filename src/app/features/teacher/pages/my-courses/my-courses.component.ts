import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { CourseService } from '../../../Course/Services/course.service';
import { TeacherCourse } from '../../models/teacher-course.model';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css'],
})
export class MyCoursesComponent {
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);

  readonly courses = signal<TeacherCourse[]>([]);
  readonly submitLoading = signal<string | null>(null);
  readonly submitError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getMyCourses().subscribe({
      next: (res) => {
        this.courses.set(res);
      },
      error: () => {
        this.courses.set([]);
      },
    });
  }

  buildCourse(courseId: string): void {
    void this.router.navigate([
      '/teacher/course-builder',
      courseId,
    ]);
  }

  submitForReview(courseId: string): void {
    if (this.submitLoading()) {
      return;
    }

    const confirmed = confirm(
      'هل أنت متأكد من إرسال الدورة للمراجعة؟',
    );

    if (!confirmed) {
      return;
    }

    this.submitLoading.set(courseId);
    this.submitError.set(null);

    this.courseService
      .submitCourseForReview(courseId)
      .subscribe({
        next: () => {
          this.submitLoading.set(null);
          this.loadCourses();
        },
        error: (err) => {
          this.submitLoading.set(null);

          const msg =
            err?.error || 'حدث خطأ أثناء إرسال الدورة للمراجعة.';

          this.submitError.set(
            typeof msg === 'string'
              ? msg
              : JSON.stringify(msg),
          );
        },
      });
  }
}

