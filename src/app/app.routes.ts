import { Routes } from '@angular/router';
import { ConfirmEmailComponent } from './features/auth/confirm-email/confirm-email.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { CheckEmailComponent } from './features/auth/check-email/check-email.component';
import { PublicLayoutComponent } from './Layout/public_layout/public-layout/public-layout.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { coursesBrowseRoutes } from './features/courses-browse/courses-browse.routes';
import { CoursesBrowseComponent } from './features/courses-browse/pages/courses-browse/courses-browse.component';
import { TeachersBrowseComponent } from './features/teacher/pages/teachers-browse/teachers-browse.component';
import { AboutUsComponent } from './features/home/pages/about-us/about-us.component';
import { TeacherDetailsComponent } from './features/teacher/pages/teacher-details/teacher-details.component';
import { CourseDetailsComponent } from './features/Course/Pages/course-details/course-details.component';
import { DashboardLayoutComponent } from './Layout/dashboard_layout/dashboard-layout/dashboard-layout.component';
import { StudentprofileComponent } from './features/student/Pages/studentprofile/studentprofile.component';
import { StudentCertificatesComponent } from './features/student/Pages/student-certificates/student-certificates.component';
import { StudentLearningCirclesComponent } from './features/student/Pages/student-learning-circles/student-learning-circles.component';
import { StudentCoursesComponent } from './features/student/Pages/student-courses/student-courses.component';
import { StudentSettingsComponent } from './features/student/Pages/student-settings/student-settings.component';
import { TeachingRequestComponent } from './features/student/Pages/teaching-request/teaching-request.component';
export const routes: Routes = [
  {
    path: '', component: PublicLayoutComponent,
    children:
      [
        {
          path: '', component: HomeComponent
        },
        {
          path: 'login',
          component: LoginComponent,
          title: 'تسجيل الدخول'
        },
        {
          path: 'signup',
          component: RegisterComponent,
          title: 'إنشاء حساب'
        },
        {
          path: 'courses',
          component: CoursesBrowseComponent,
          title: 'تصفح الدورات المقدمة من منصة الفرقان'
        },
        {
          path: 'course-details/:id',
          component: CourseDetailsComponent,
          title: 'تفاصيل الدورة'
        },
        {
          path: 'teachers',
          component: TeachersBrowseComponent,
          title: 'تصفح المعلمون المسجلون علي من منصة الفرقان'
        },
        {
          path: 'teachers/:id/details',
          component: TeacherDetailsComponent,
          title: 'تفاصيل عن المعلم'
        },
        {
          path: 'about',
          component: AboutUsComponent,
          title: 'من نحن | تعرف علي فريق الفرقان'
        },
        {
          path: 'confirm-email',
          component: ConfirmEmailComponent,
          title: 'تأكيد البريد الإلكتروني'
        },
        {
          path: 'forgot-password',
          component: ResetPasswordComponent,
          title: 'نسيت كلمة المرور'
        },
        {
          path: 'reset-password',
          component: ResetPasswordComponent,
          title: 'إعادة تعيين كلمة المرور'
        },
        {
          path: 'check-email',
          component: CheckEmailComponent,
          title: 'التحقق من البريد الإلكتروني'
        }
      ]
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'student',
        loadChildren: () => import('./features/student/student.routes').then((m) => m.STUDENT_ROUTES),
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
      },

    ]
  },
  {
    path: 'teacher',
    // loadComponent: () =>
    //   import('./features/teacher/pages/dashboard/dashboard.component').then(
    //     (m) => m.DashboardComponent
    //   ),
    loadChildren: () => import('./features/teacher/teacher.routes').then((m) => m.TEACHER_ROUTES),

  },
  {
    path: '',
    loadChildren: () =>
      import('./features/live-sessions/live-sessions.routes')
        .then(m => m.LIVE_SESSIONS_ROUTES),
  },

];
