import { Routes } from '@angular/router';
import { ConfirmEmailComponent } from './features/auth/confirm-email/confirm-email.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { CheckEmailComponent } from './features/auth/check-email/check-email.component';
import { PointPackagesComponent } from './features/points/pages/point-packages/point-packages.component';
import { PublicLayoutComponent } from './Layout/public_layout/public-layout/public-layout.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { CoursesBrowseComponent } from './features/courses-browse/pages/courses-browse/courses-browse.component';
import { TeachersBrowseComponent } from './features/teacher/pages/teachers-browse/teachers-browse.component';
import { AboutUsComponent } from './features/home/pages/about-us/about-us.component';
import { TeacherDetailsComponent } from './features/teacher/pages/teacher-details/teacher-details.component';
import { DashboardLayoutComponent } from './Layout/dashboard_layout/dashboard-layout/dashboard-layout.component';
import { StudentprofileComponent } from './features/student/Pages/studentprofile/studentprofile.component';
import { StudentSettingsComponent } from './features/student/Pages/student-settings/student-settings.component';
import { TeachingRequestComponent } from './features/student/Pages/teaching-request/teaching-request.component';
import { CheckoutComponent } from './features/points/pages/checkout/checkout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'تسجيل الدخول',
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'إنشاء حساب',
      },
      {
        path: 'courses',
        component: CoursesBrowseComponent,
        title: 'تصفح الدورات المقدمة من منصة الفرقان',
      },
      {
        path: 'course-details/:id',
        loadComponent: () =>
          import('./features/Course/Pages/course-details/course-details.component')
            .then((m) => m.CourseDetailsComponent),
        title: 'تفاصيل الدورة',
      },
      {
        path: 'teachers',
        component: TeachersBrowseComponent,
        title: 'تصفح المعلمون المسجلون علي من منصة الفرقان',
      },
      {
        path: 'teachers/:id/details',
        component: TeacherDetailsComponent,
        title: 'تفاصيل عن المعلم',
      },
      {
        path: 'about',
        component: AboutUsComponent,
        title: 'من نحن | تعرف علي فريق الفرقان',
      },
      {
        path: 'confirm-email',
        component: ConfirmEmailComponent,
        title: 'تأكيد البريد الإلكتروني',
      },
      {
        path: 'forgot-password',
        component: ResetPasswordComponent,
        title: 'نسيت كلمة المرور',
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        title: 'إعادة تعيين كلمة المرور',
      },
      {
        path: 'check-email',
        component: CheckEmailComponent,
        title: 'التحقق من البريد الإلكتروني',
      },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'student',
        loadChildren: () =>
          import('./features/student/student.routes').then((m) => m.STUDENT_ROUTES),
      },

      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
      },


    ],
  },
  {
    path: 'teacher',
    loadChildren: () =>
      import('./features/teacher/teacher.routes').then((m) => m.TEACHER_ROUTES),
  },
  {
    path: 'studentprofile',
    loadComponent: () =>
      import('./features/student/Pages/studentprofile/studentprofile.component')
        .then((m) => m.StudentprofileComponent),
    title: 'الملف الشخصي للطالب',
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/student/Pages/student-settings/student-settings.component')
        .then((m) => m.StudentSettingsComponent),
    title: 'الإعدادات',
  },
  {
    path: 'studentprofile/teaching-request',
    loadComponent: () =>
      import('./features/student/Pages/teaching-request/teaching-request.component')
        .then((m) => m.TeachingRequestComponent),
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./features/live-sessions/live-sessions.routes')
        .then((m) => m.LIVE_SESSIONS_ROUTES),
  },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'forgot-password', component: ResetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'check-email', component: CheckEmailComponent },

  {
    path: 'circle-chat',
    loadChildren: () =>
      import('./features/circle-chat/circle-chat.routes').then(
        (m) => m.CIRCLE_CHAT_ROUTES
      ),
  },
  {
    path: 'confirm-email',
    component: ConfirmEmailComponent,
  },
  {
    path: 'forgot-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'check-email',
    component: CheckEmailComponent,
  },
  {
    path: 'pointPackages',
    component: PointPackagesComponent,
  },
  {
    path: 'course-checkout/:id',
    loadComponent: () =>
      import('./features/Course/Pages/checkout/course-checkout.component')
        .then((m) => m.CourseCheckoutComponent),
    title: 'إتمام شراء الدورة',
  },
  {
    path: 'payment-processing/:paymentId',
    loadComponent: () =>
      import('./features/payment/pages/payment-processing/payment-processing.component')
        .then((m) => m.PaymentProcessingComponent),
    title: 'جارِ معالجة الدفع',
  },
  {
    path: 'payment-success/:paymentId',
    loadComponent: () =>
      import('./features/payment/pages/payment-success/payment-success.component')
        .then((m) => m.PaymentSuccessComponent),
    title: 'تم الدفع بنجاح',
  },
  {
    path: 'payment-failed/:paymentId',
    loadComponent: () =>
      import('./features/payment/pages/payment-failed/payment-failed.component')
        .then((m) => m.PaymentFailedComponent),
    title: 'فشلت عملية الدفع',
  },
  {path:'checkout/:id',component:CheckoutComponent}
];
