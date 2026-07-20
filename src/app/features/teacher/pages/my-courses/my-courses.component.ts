import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { QuickActionsComponent } from '../../components/quick-actions/quick-actions.component';
import { CourseService } from '../../../Course/Services/course.service';
import { TeacherCourse } from '../../models/teacher-course.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, QuickActionsComponent],
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css'],
})
export class MyCoursesComponent {
  private courseService = inject(CourseService);

  private router = inject(Router);

  courses: TeacherCourse[] = [];

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getMyCourses().subscribe({
      next: (res) => {
        this.courses = res;
      },
    });
  }

  buildCourse(courseId: string) {
    this.router.navigate(['/teacher/course-builder', courseId]);
  }
}
