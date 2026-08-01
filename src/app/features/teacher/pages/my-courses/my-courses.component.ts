import { Component, inject, signal } from '@angular/core';

import { CourseService } from '../../../Course/Services/course.service';
import { TeacherCourse } from '../../models/teacher-course.model';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css'],
})
export class MyCoursesComponent {
  private courseService = inject(CourseService);

  private router = inject(Router);
  courses = signal<TeacherCourse[]>([]);

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    console.log('Loading Courses');

    this.courseService.getMyCourses().subscribe({
      next: (res) => {
        console.log('Response:', res);
        this.courses.set(res);
      },
      error: (err) => {
        console.error('Error:', err);
      },
      complete: () => {
        console.log('Completed');
      },
    });
  }

  buildCourse(courseId: string) {
    this.router.navigate(['/teacher/course-builder', courseId]);
  }
}
