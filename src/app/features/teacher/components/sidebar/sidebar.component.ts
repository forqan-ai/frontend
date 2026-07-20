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
      icon: 'dashboard',
      route: '/teacher',
    },
    {
      title: 'إنشاء دورة',
      icon: 'add',
      route: '/teacher/create-course',
    },
    {
      title: 'دوراتي',
      icon: 'menu_book',
      route: '/teacher/my-courses',
    },

    {
      title: 'الطلاب',
      icon: 'groups',
      route: '/teacher/students',
    },
    {
      title: 'حلقات العلم',
      icon: 'school',
      route: '/teacher/circles',
    },
    {
      title: 'الملف الشخصي',
      icon: 'person',
      route: '/teacher/profile',
    },
    {
      title: 'الإعدادات',
      icon: 'settings',
      route: '/teacher/settings',
    },
  ]);

  closeSidebar() {
    this.close.emit();
  }
}
