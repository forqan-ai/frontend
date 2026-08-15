import { Routes } from '@angular/router';
import { AdminTeachingRequestsComponent } from './pages/admin-teaching-requests/admin-teaching-requests.component';
import { AdminCoursesReviewComponent } from './pages/admin-courses-review/admin-courses-review.component';
import { AdminTeachingRequestDetailsComponent } from './pages/admin-teaching-request-details/admin-teaching-request-details.component';
import { AdminProfileRequestsComponent } from './pages/admin-profile-requests/admin-profile-requests.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'teaching-requests',
  },
  {
    path: 'teaching-requests',
    component: AdminTeachingRequestsComponent,
    title: 'طلبات التدريس',
  },
  {
    path: 'teaching-requests/:id',
    component: AdminTeachingRequestDetailsComponent,
    title: 'تفاصيل طلب  التقديم',
  },

  {
    path: 'courses-review',
    component: AdminCoursesReviewComponent,
    title: 'مراجعة الدورات',
  },
  {
    path: 'profile-change-requests',
    component: AdminProfileRequestsComponent,
  },
  {
    path: 'bookings',
    loadComponent: () =>
      import('../live-sessions/Pages/admin-bookings/admin-bookings.component').then(
        (m) => m.AdminBookingsComponent,
      ),
    title: 'إدارة الحجوزات',
  },
  {
    path: 'withdrawals',
    loadComponent: () =>
      import('./pages/admin-withdrawals/admin-withdrawals.component').then(
        (m) => m.AdminWithdrawalsComponent,
      ),
    title: 'إدارة السحوبات',
  },
  {
    path: 'withdrawals/:id',
    loadComponent: () =>
      import('./pages/admin-withdrawal-details/admin-withdrawal-details.component').then(
        (m) => m.AdminWithdrawalDetailsComponent,
      ),
    title: 'تفاصيل طلب السحب',
  },
];
