import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCourseService } from '../../services/admin-course.service';
import { TeacherCourse } from '../../../teacher/models/teacher-course.model';
import { CourseBuilderDto, LessonBuilderDto } from '../../models/course-builder-dto.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-admin-courses-review',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './admin-courses-review.component.html',
  styleUrl: './admin-courses-review.component.css',
})
export class AdminCoursesReviewComponent implements OnInit {
  private adminCourseService = inject(AdminCourseService);

  courses = signal<TeacherCourse[]>([]);

  selectedCourse = signal<CourseBuilderDto | null>(null);

  selectedLesson = signal<any | null>(null);

  loading = signal(false);

  detailsLoading = signal(false);

  rejectDialog = signal(false);

  rejectionReason = signal('');

  actionLoading = signal(false);

  ngOnInit(): void {
    this.loadPendingCourses();
  }

  loadPendingCourses(): void {
    this.loading.set(true);

    this.adminCourseService.getPendingCourses().subscribe({
      next: (res) => {
        console.log('Pending courses:', res);

        this.courses.set(res);

        this.loading.set(false);
      },

      error: (err) => {
        console.error('Error loading pending courses:', err);

        this.loading.set(false);
      },
    });
  }

  reviewCourse(courseId: string): void {
    console.log('Review course clicked:', courseId);

    this.detailsLoading.set(true);

    this.adminCourseService.getPendingCourse(courseId).subscribe({
      next: (course) => {
        console.log('========== ADMIN COURSE ==========');
        console.log(course);

        course.modules.forEach((module) => {
          console.log('MODULE:', module.title);

          module.lessons.forEach((lesson) => {
            console.log('LESSON:', lesson);
            console.log('CONTENT URL:', lesson.contentURL);
          });
        });

        console.log('==================================');

        this.selectedCourse.set(course);
        this.detailsLoading.set(false);
      },

      error: (err) => {
        console.error('Error loading course details:', err);
        this.detailsLoading.set(false);
      },
    });
  }

  selectLesson(lesson: LessonBuilderDto): void {
    this.selectedLesson.set(lesson);
  }
  closeReview(): void {
    this.selectedCourse.set(null);
    this.selectedLesson.set(null);
    this.rejectDialog.set(false);
    this.rejectionReason.set('');
  }

  approveCourse(): void {
    const course = this.selectedCourse();

    if (!course) {
      return;
    }

    this.actionLoading.set(true);

    this.adminCourseService.approveCourse(course.courseID).subscribe({
      next: () => {
        console.log('Course approved');

        this.actionLoading.set(false);

        this.closeReview();

        this.loadPendingCourses();
      },

      error: (err) => {
        console.error('Approve error:', err);

        this.actionLoading.set(false);
      },
    });
  }

  openRejectDialog(): void {
    this.rejectionReason.set('');

    this.rejectDialog.set(true);
  }

  closeRejectDialog(): void {
    this.rejectDialog.set(false);

    this.rejectionReason.set('');
  }

  onRejectionReasonChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;

    this.rejectionReason.set(target.value);
  }

  rejectCourse(): void {
    const course = this.selectedCourse();

    if (!course) {
      return;
    }

    const reason = this.rejectionReason().trim();

    if (!reason) {
      return;
    }

    this.actionLoading.set(true);

    this.adminCourseService.rejectCourse(course.courseID, reason).subscribe({
      next: () => {
        console.log('Course rejected');

        this.actionLoading.set(false);

        this.closeReview();

        this.loadPendingCourses();
      },

      error: (err) => {
        console.error('Reject error:', err);

        this.actionLoading.set(false);
      },
    });
  }
}
