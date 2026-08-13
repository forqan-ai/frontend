import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Service()
export class RoutingService {

    authService = inject(AuthService);
    router = inject(Router);
    routeToHome() {
        if (!this.authService.IsAuthenticated()) {
            this.router.navigateByUrl('/');
            return;
        }
        const role = this.authService.getRole();
        if (role === 'Student') {
            this.router.navigateByUrl('/student')
        }
        else if (role === 'Teacher') {
            this.router.navigateByUrl('/teacher');
        } else if (role === 'Admin') {
            this.router.navigateByUrl('/admin');
        }
        return;
    }
}
