import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreateCourseComponent } from './pages/create-course/create-course.component';

export const TEACHER_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },

  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'create-course',
    component: CreateCourseComponent,
  },
  {
    path: 'course-builder/:courseId',
    loadComponent: () =>
      import('./pages/course-builder/course-builder.component').then(
        (c) => c.CourseBuilderComponent,
      ),
  },

  {
    path: 'my-courses',
    loadComponent: () =>
      import('./pages/my-courses/my-courses.component').then((c) => c.MyCoursesComponent),
  },
];
