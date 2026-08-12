import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';



@Component({
  selector: 'app-student-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-courses.component.html',
  styleUrl: './student-courses.component.css'
})
export class StudentCoursesComponent implements OnInit {

  private http = inject(HttpClient);
  private router = inject(Router);

  courses: StudentEnrollment[] = [];
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {

    this.loading.set(true);
    this.error.set('');

    this.http.get<StudentEnrollment[]>(
      `${environment.apiUrl}/api/users/student/enrollments`
    ).subscribe({

      next: (response) => {

        console.log('Courses loaded:', response);

        this.courses = response;

        this.loading.set(false);

      },

      error: (error) => {

        console.error('Failed to load courses:', error);

        this.error.set('حدث خطأ أثناء تحميل الدورات');

        this.loading.set(false);

      }

    });
  }

  continueCourse(course: StudentEnrollment): void {
    this.router.navigate([`/student/course-player`, course.courseID]);
  }

  getProgressText(course: StudentEnrollment): string {
    if (course.isCompleted || course.progressPercent >= 100) {
      return 'مكتملة';
    }

    if (course.progressPercent === 0) {
      return 'لم تبدأ بعد';
    }

    return `أكملت ${course.progressPercent}%`;
  }

  getCourseIcon(index: number): string {
    const icons = [
      'bi-book',
      'bi-mortarboard',
      'bi-journal-bookmark',
      'bi-book-half'
    ];

    return icons[index % icons.length];
  }

  getProgressClass(progress: number): string {
    if (progress >= 100) {
      return 'completed';
    }

    if (progress >= 50) {
      return 'good';
    }

    if (progress > 0) {
      return 'started';
    }

    return 'not-started';
  }
}