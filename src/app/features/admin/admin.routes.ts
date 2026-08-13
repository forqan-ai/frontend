import { Routes } from "@angular/router";
import { AdminTeachingRequestsComponent } from "./pages/admin-teaching-requests/admin-teaching-requests.component";
import { AdminCoursesReviewComponent } from "./pages/admin-courses-review/admin-courses-review.component";
import { AdminTeachingRequestDetailsComponent } from "./pages/admin-teaching-request-details/admin-teaching-request-details.component";
import { adminGuard } from "../../core/guards/admin-guard";
export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        canActivateChild: [adminGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'teaching-requests',
            },
            {
                path: 'teaching-requests',
                // component: AdminTeachingRequestsComponent,
                loadComponent: () =>
                    import('../admin/pages/admin-teaching-requests/admin-teaching-requests.component')
                        .then(m => m.AdminTeachingRequestsComponent),
                title: 'طلبات التدريس',
            },
            {
                path: 'teaching-requests/:id',
                // component: AdminTeachingRequestDetailsComponent,
                loadComponent: () =>
                    import('../admin/pages/admin-teaching-request-details/admin-teaching-request-details.component')
                        .then(m => m.AdminTeachingRequestDetailsComponent),
                title: 'تفاصيل طلب التقديم',
            },
            {
                path: 'courses-review',
                // component: AdminCoursesReviewComponent,
                loadComponent: () =>
                    import('../admin/pages/admin-courses-review/admin-courses-review.component')
                        .then(m => m.AdminCoursesReviewComponent),
                title: 'مراجعة الدورات',
            },
            {
                path: 'bookings',
                loadComponent: () =>
                    import('../live-sessions/Pages/admin-bookings/admin-bookings.component')
                        .then(m => m.AdminBookingsComponent),
                title: 'إدارة الحجوزات',
            }
        ]
    }
];
