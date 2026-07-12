import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    title: 'إنشاء حساب',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    title: ' تسجيل الدخول',
  },
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
