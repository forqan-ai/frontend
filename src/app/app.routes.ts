import { Routes } from '@angular/router';
import { ConfirmEmailComponent } from './features/auth/confirm-email/confirm-email.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { CheckEmailComponent } from './features/auth/check-email/check-email.component';
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
    path: 'teachers/:id/details',
    loadComponent: () => import('./features/teacher/pages/teacher-details/teacher-details.component').then(
      m => m.TeacherDetailsComponent
    )
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
  },
  {
    path: 'studentprofile',
    loadComponent: () =>
      import('./features/student/Components/studentprofile/studentprofile.component').then(
        (m) => m.StudentprofileComponent
      ),
    title: 'الملف الشخصي للطالب',
  },




  
  {
    path: 'courses',
    loadChildren: () =>
      import(
        './features/courses-browse/courses-browse.routes'
      ).then(
        (module) =>
          module.coursesBrowseRoutes,
      ),
  },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'forgot-password', component: ResetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'check-email', component: CheckEmailComponent }
];
