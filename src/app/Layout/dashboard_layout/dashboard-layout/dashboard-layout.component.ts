import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { StudentMobileSidebarComponent } from '../../../features/student/Components/student-mobile-sidebar/student-mobile-sidebar.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { StudentSidebarComponent } from '../../../features/student/Components/student-sidebar/student-sidebar.component';
import { StudentMobileNavbarComponent } from '../../../features/student/Components/student-mobile-navbar/student-mobile-navbar.component';
import { MobileSidebarComponent } from '../../../features/admin/components/admin-mobile-sidebar/admin-mobile-sidebar.component';
import { AdminMobileNavbarComponent } from '../../../features/admin/components/admin-mobile-navbar/admin-mobile-navbar.component';
import { AdminSidebarComponent } from '../../../features/admin/components/admin-sidebar/admin-sidebar.component';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/auth.models';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    StudentSidebarComponent,
    RouterOutlet,
    ToastComponent,
    NavbarComponent,
    StudentSidebarComponent,
    StudentMobileNavbarComponent,
    StudentMobileSidebarComponent,
    MobileSidebarComponent,
    AdminMobileNavbarComponent,
    AdminSidebarComponent,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {
  authService = inject(AuthService);

  protected readonly Role = Role;

  userRole = signal<Role>(Role.Student); //initial value

  ngOnInit() {
    this.userRole.set(this.authService.getRole()!);
    console.log(this.authService.getRole());
  }
}
