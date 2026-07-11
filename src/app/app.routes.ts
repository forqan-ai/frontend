import { Routes } from '@angular/router';

export const routes: Routes = [
  {
<<<<<<< HEAD
    path: '',
=======
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
>>>>>>> 49af35e055f3ae63977df366804dd645a070d8cc
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
