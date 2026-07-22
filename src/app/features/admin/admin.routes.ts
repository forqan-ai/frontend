import { Routes } from "@angular/router";
import { AdminTeachingRequestsComponent } from "./pages/admin-teaching-requests/admin-teaching-requests.component";
import { AdminCoursesReviewComponent } from "./pages/admin-courses-review/admin-courses-review.component";

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'teaching-requests'
    },
    {
        path: 'teaching-requests',
        component: AdminTeachingRequestsComponent,
        title: 'طلبات التدريس'
    },
    {
        path: 'courses-review',
        component: AdminCoursesReviewComponent,
        title: 'مراجعة الدورات'
    },
    {
        path: 'bookings',
        loadComponent: () => import('../../live-sessions/Pages/admin-bookings/admin-bookings.component').then((m) => m.AdminBookingsComponent),
        title: 'إدارة الحجوزات'
    }
]