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
    component: CreateCourseComponent
}

  // {
  //   path: 'my-courses',
  //   component: MyCoursesComponent
  // },

  // {
  //   path: 'create-course',
  //   component: CreateCourseComponent
  // }
];
