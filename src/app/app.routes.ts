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
import { CheckoutComponent } from './features/points/pages/checkout/checkout.component';
import { TeacherLayoutComponent } from './Layout/teacher_layout/teacher-layout/teacher-layout.component';
import { StudentDashboardComponent } from './Layout/dashboard_layout/student-dashboard/student-dashboard.component';
import { AdminDashboardComponent } from './Layout/dashboard_layout/admin-dashboard/admin-dashboard.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
import { UnauthorizedComponent } from './shared/pages/unauthorized/unauthorized.component';
import { adminGuard } from './core/guards/admin-guard';

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
        path: 'courses/:id/:teacherid',
        component: TeacherDetailsComponent,
        title: 'تفاصيل عن المعلم'
      },
      {
        path: 'courses/:id',
        loadComponent: () =>
          import('./features/Course/Pages/course-details/course-details.component').then(
            (m) => m.CourseDetailsComponent,
          ),
        title: 'تفاصيل الدورة',
      },
      {
        path: 'courses',
        component: CoursesBrowseComponent,
        title: 'تصفح الدورات المقدمة من منصة الفرقان',
      },
      {
        path: 'course-details/:courseId/certificate',
        loadComponent: () =>
          import('./features/Course/Pages/certificate/certificate.component').then(
            (m) => m.CertificateComponent,
          ),
        title: 'شهادة إتمام الدورة',
      },
      {
        path: 'teachers',
        component: TeachersBrowseComponent,
        title: 'تصفح المعلمون المسجلون علي من منصة الفرقان',
      },
      {
        path: 'teachers/:teacherid/details',
        component: TeacherDetailsComponent,
        title: 'تفاصيل عن المعلم',
      },
      {
        path: 'about',
        component: AboutUsComponent,
        title: 'من نحن | تعرف علي فريق الفرقان',
      },
      {
        path: 'privacy-policy',
        loadComponent: () =>
          import('./features/support/pages/privacy-policy/privacy-policy.component').then(
            (m) => m.PrivacyPolicyComponent,
          ),
        title: 'سياسة الخصوصية | الفرقان',
      },
      {
        path: 'terms-and-conditions',
        loadComponent: () =>
          import(
            './features/support/pages/terms-and-conditions/terms-and-conditions.component'
          ).then((m) => m.TermsAndConditionsComponent),
        title: 'الشروط والأحكام | الفرقان',
      },
      {
        path: 'contact-us',
        loadComponent: () =>
          import('./features/support/pages/contact-us/contact-us.component').then(
            (m) => m.ContactUsComponent,
          ),
        title: 'اتصل بنا | الفرقان',
      },
      {
        path: 'help-center',
        loadComponent: () =>
          import('./features/support/pages/help-center/help-center.component').then(
            (m) => m.HelpCenterComponent,
          ),
        title: 'مركز المساعدة | الفرقان',
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
  // {
  //   path: 'dashboard',
  //   component: DashboardLayoutComponent,
  //   children: [
  //     {
  //       path: 'student',
  //       loadChildren: () =>
  //         import('./features/student/student.routes').then((m) => m.STUDENT_ROUTES),
  //     },
  //     {
  //       path: 'admin',
  //       loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  //     },
  //   ],
  // },
  {
    path: 'chat',
    loadComponent: () =>
      import('./features/ai/pages/chat/chat.component').then(m => m.ChatComponent),
    title: 'المساعد الذكي'
  },
  {
    path: 'student',
    component: StudentDashboardComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/student/student.routes').then((m) => m.STUDENT_ROUTES),
      },
    ]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
      },
    ]
  },
  {
    path: 'teacher',
    component: TeacherLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/teacher/teacher.routes').then((m) => m.TEACHER_ROUTES),
      },
    ],
  },
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'course-details/:id/:teacherid',
    component: TeacherDetailsComponent,
    title: 'تفاصيل عن المعلم'
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
      import('./features/student/Pages/student-settings/student-settings.component').then(
        (m) => m.StudentSettingsComponent,
      ),
    title: 'الإعدادات',
  },
  {
    path: 'studentprofile/teaching-request',
    loadComponent: () =>
      import('./features/student/Pages/teaching-request/teaching-request.component').then(
        (m) => m.TeachingRequestComponent,
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/live-sessions/live-sessions.routes').then((m) => m.LIVE_SESSIONS_ROUTES),
  },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'forgot-password', component: ResetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'check-email', component: CheckEmailComponent },
  {
    path: 'pointPackages',
    component: PointPackagesComponent,
    title: 'شراء نقاط'
  },
  {
    path: 'course-checkout/:id',
    loadComponent: () =>
      import('./features/Course/Pages/checkout/course-checkout.component').then(
        (m) => m.CourseCheckoutComponent,
      ),
    title: 'إتمام شراء الدورة',
  },
  {
    path: 'payment-processing/:paymentId',
    loadComponent: () =>
      import('./features/payment/pages/payment-processing/payment-processing.component').then(
        (m) => m.PaymentProcessingComponent,
      ),
    title: 'جارِ معالجة الدفع',
  },
  {
    path: 'payment-success/:paymentId',
    loadComponent: () =>
      import('./features/payment/pages/payment-success/payment-success.component').then(
        (m) => m.PaymentSuccessComponent,
      ),
    title: 'تم الدفع بنجاح',
  },
  {
    path: 'payment-failed/:paymentId',
    loadComponent: () =>
      import('./features/payment/pages/payment-failed/payment-failed.component').then(
        (m) => m.PaymentFailedComponent,
      ),
    title: 'فشلت عملية الدفع',
  },
  {
    path: 'checkout/:id',
    component: CheckoutComponent,
    title: 'متابعة عملية الدفع'
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];
