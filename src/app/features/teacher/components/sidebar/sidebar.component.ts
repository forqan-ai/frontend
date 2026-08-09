import { Component, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarItem } from '../../models/sidebar-item';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  opened = input(false);

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
      icon: 'bi bi-mortarboard-fill',
      route: '/teacher/circles',
    },
    {
      title: 'الملف الشخصي',
      icon: 'bi bi-person-fill',
      route: '/teacher/profile',
    },
    {
      title: 'الإعدادات',
      icon: 'bi bi-gear-fill',
      route: '/teacher/settings',
    },
  ]);

  closeSidebar() {
    this.close.emit();
  }
}
