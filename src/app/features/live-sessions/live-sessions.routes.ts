import { Routes } from '@angular/router';

export const LIVE_SESSIONS_ROUTES: Routes = [
  {
    path: 'circles/:circleId/sessions',
    loadComponent: () =>
      import('./Pages/circle-sessions/circle-sessions.component').then(
        (m) => m.CircleSessionsComponent
      ),
  },
  {
    path: 'circles/:circleId/sessions/new',
    loadComponent: () =>
      import('./Pages/session-form/session-form.component').then(
        (m) => m.SessionFormComponent
      ),
  },
  {
    path: 'sessions/:sessionId/edit',
    loadComponent: () =>
      import('./Pages/session-form/session-form.component').then(
        (m) => m.SessionFormComponent
      ),
  },
  {
    path: 'sessions/:sessionId',
    loadComponent: () =>
      import('./Pages/session-details/session-details.component').then(
        (m) => m.SessionDetailsComponent
      ),
  },
  {
    path: 'my-bookings',
    loadComponent: () =>
      import('./Pages/my-bookings/my-bookings.component').then(
        (m) => m.MyBookingsComponent
      ),
  },
  {
    path: 'admin/bookings',
    loadComponent: () =>
      import('./Pages/admin-bookings/admin-bookings.component').then(
        (m) => m.AdminBookingsComponent
      ),
  },
];
