import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const teacherRoutes: Routes = [

  {
    path: '',
    component: DashboardComponent
  },

  {
    path: 'profile',
    component: ProfileComponent
  },

//   {
//     path: 'my-courses',
//     component: MyCoursesComponent
//   },

//   {
//     path: 'create-course',
//     component: CreateCourseComponent
//   }

];