import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CanActivateChildFn } from '@angular/router';

export const adminGuard: CanActivateChildFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.IsAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (authService.getRole() !== 'Admin') {
    return router.createUrlTree(['/unauthorized']);
  }

  return true;
};
