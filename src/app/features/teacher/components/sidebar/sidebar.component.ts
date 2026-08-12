import { Component, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarItem } from '../../models/sidebar-item';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  opened = input(false);
  authservice = inject(AuthService);
  router = inject(Router);

  close = output<void>();

  menu = signal<SidebarItem[]>([
    {
      title: 'لوحة التحكم',
      icon: 'bi bi-grid-1x2-fill',
      route: '/teacher',
    },
    {
      title: 'إنشاء دورة',
      icon: 'bi bi-plus-lg',
      route: '/teacher/create-course',
    },
    {
      title: 'دوراتي',
      icon: 'bi bi-journal-bookmark-fill',
      route: '/teacher/my-courses',
    },
    {
      title: 'الطلاب',
      icon: 'bi bi-people-fill',
      route: '/teacher/students',
    },
    {
      title: 'حلقات العلم',
      icon: 'bi bi-bounding-box-circles',
      route: '/teacher/circles',
    },
    {
      title: 'المحفظة',
      icon: 'bi bi-wallet2',
      route: '/teacher/wallet',
    },
    {
      title: 'الملف الشخصي',
      icon: 'bi bi-person-fill',
      route: '/teacher/profile',
    },
  ]);

  closeSidebar() {
    this.close.emit();
  }

  goToStudent(): void {
    this.router.navigate(['/student/home']);
  }

    logout(): void {
    this.authservice.logout();
    this.router.navigate(['/login']);
  }
}
