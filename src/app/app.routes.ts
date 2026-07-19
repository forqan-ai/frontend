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
    path: 'teacher',
    loadChildren: () => import('./features/teacher/teacher.routes').then((m) => m.TEACHER_ROUTES),
  },
  {
    path: 'teachers/:id/details',
    loadComponent: () =>
      import('./features/teacher/pages/teacher-details/teacher-details.component').then(
        (m) => m.TeacherDetailsComponent,
      ),
  },
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'course-details/:id',
    loadComponent: () =>
      import('./features/Course/Pages/course-details/course-details.component').then(
        (m) => m.CourseDetailsComponent,
      ),
  },
  {
    path: 'studentprofile',
    loadComponent: () =>
      import('./features/student/Pages/studentprofile/studentprofile.component').then(
        (m) => m.StudentprofileComponent,
      ),
    title: 'الملف الشخصي للطالب',
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/student/Pages/settings/settings.component').then(
        (m) => m.SettingsComponent,
      ),
    title: 'الإعدادات',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/teacher/pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
  path: 'course-player/:id',
  loadComponent: () =>
    import('./features/Course/Pages/course-player/course-player.component')
      .then(m => m.CoursePlayerComponent)
},
  {
    path: 'studentprofile/teaching-request',
    loadComponent: () =>
      import('./features/teacher/pages/teaching-request/teaching-request.component').then(
        (m) => m.TeachingRequestComponent
      ),
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./features/courses-browse/courses-browse.routes').then(
        (module) => module.coursesBrowseRoutes,
      ),
  },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'forgot-password', component: ResetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'check-email', component: CheckEmailComponent },
  {
  path: '',
  loadChildren: () =>
    import('./features/live-sessions/live-sessions.routes')
      .then(m => m.LIVE_SESSIONS_ROUTES),
},

];
