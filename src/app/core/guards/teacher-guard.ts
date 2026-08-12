import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const teacherGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.IsAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (authService.getRole() !== 'Teacher') {
    return router.createUrlTree(['/unauthorized']);
  }

  return true;
};
