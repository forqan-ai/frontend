import { Component } from '@angular/core';
import { SidebarComponent } from "../../../features/student/Components/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from "../../../shared/components/toast/toast.component";
import { MobileSidebarComponent } from "../../../features/student/Components/mobile-sidebar/mobile-sidebar.component";
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { MobileNavbarComponent } from "../../../features/student/Components/mobile-navbar/mobile-navbar.component";

@Component({
  selector: 'app-dashboard-layout',
  imports: [SidebarComponent, RouterOutlet, ToastComponent, MobileSidebarComponent, NavbarComponent, MobileNavbarComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {

}
