import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'course-details/:id',
    loadComponent: () =>
      import('./features/Course/Pages/course-details/course-details.component').then(
        m => m.CourseDetailsComponent
      )
  }
];
