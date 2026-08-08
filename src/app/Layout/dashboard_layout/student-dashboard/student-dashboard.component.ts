import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/auth.models';
import { StudentMobileNavbarComponent } from "../../../features/student/Components/student-mobile-navbar/student-mobile-navbar.component";
import { StudentMobileSidebarComponent } from "../../../features/student/Components/student-mobile-sidebar/student-mobile-sidebar.component";
import { StudentSidebarComponent } from "../../../features/student/Components/student-sidebar/student-sidebar.component";
import { ToastComponent } from "../../../shared/components/toast/toast.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  imports: [StudentMobileNavbarComponent, StudentMobileSidebarComponent, StudentSidebarComponent, ToastComponent, RouterOutlet],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css',
})
export class StudentDashboardComponent {
  authService = inject(AuthService);

  protected readonly Role = Role;

  userRole = signal<Role>(Role.Student); //initial value

  ngOnInit() {
    this.userRole.set(this.authService.getRole()!);
    console.log(this.authService.getRole());
  }
}
