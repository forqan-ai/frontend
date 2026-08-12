import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/auth.models';
import { MobileSidebarComponent } from "../../../features/admin/components/admin-mobile-sidebar/admin-mobile-sidebar.component";
import { AdminMobileNavbarComponent } from "../../../features/admin/components/admin-mobile-navbar/admin-mobile-navbar.component";
import { AdminSidebarComponent } from "../../../features/admin/components/admin-sidebar/admin-sidebar.component";
import { ToastComponent } from "../../../shared/components/toast/toast.component";
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-admin-dashboard',
  imports: [MobileSidebarComponent, AdminMobileNavbarComponent, AdminSidebarComponent, ToastComponent, RouterOutlet],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  authService = inject(AuthService);

  protected readonly Role = Role;

  userRole = signal<Role>(Role.Student); //initial value

  ngOnInit() {
    this.userRole.set(this.authService.getRole()!);
    console.log(this.authService.getRole());
  }
}
