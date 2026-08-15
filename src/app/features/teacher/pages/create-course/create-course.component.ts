import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { QuickActionsComponent } from '../../components/quick-actions/quick-actions.component';
import { CreateCourseFormComponent } from '../../components/create-course-form/create-course-form.component';

import { CourseService } from '../../../Course/Services/course.service';
import { ToastService } from '../../../../core/services/toast.service';

import { TeacherDashboard } from '../../models/teacher-dashboard.model';
import { TeacherProfile } from '../../models/teacher-profile.model';
import { TeacherService } from '../../services/teacher.service';

import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    QuickActionsComponent,
    CreateCourseFormComponent,
    ScrollRevealDirective
  ],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.css',
})
export class CreateCourseComponent {

  sidebarOpen = signal(false);

  private courseService = inject(CourseService);
  private teacherService = inject(TeacherService);
  private toast = inject(ToastService);
  private router = inject(Router);

  dashboard = signal<TeacherDashboard | null>(null);
  profile = signal<TeacherProfile | null>(null);

  ngOnInit(): void {
    this.loadDashboard();
    this.loadProfile();
  }

  loadDashboard() {
    this.teacherService.getDashboard().subscribe({
      next: (res) => this.dashboard.set(res),
      error: console.error,
    });
  }

  loadProfile() {
    this.teacherService.getProfile().subscribe({
      next: (res) => this.profile.set(res),
      error: console.error,
    });
  }

  saveCourse(data: FormData) {
    this.courseService.createCourse(data).subscribe({
      next: (courseId: string) => {
        this.toast.show('تم إنشاء الدورة بنجاح');

        this.router.navigate([
          '/teacher/course-builder',
          courseId
        ]);
      },

      error: () => {
        this.toast.show(
          'حدث خطأ أثناء إنشاء الدورة',
          'error'
        );
      },
    });
  }

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}