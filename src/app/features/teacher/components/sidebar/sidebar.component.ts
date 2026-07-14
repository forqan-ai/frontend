import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarItem } from '../../models/sidebar-item';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  menu = signal<SidebarItem[]>([
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/teacher/dashboard'
    },
    {
      title: 'My Courses',
      icon: 'menu_book',
      route: '/teacher/courses'
    },
    {
      title: 'Students',
      icon: 'groups',
      route: '/teacher/students'
    },
    {
      title: 'Learning Circles',
      icon: 'school',
      route: '/teacher/circles'
    },
    {
      title: 'Profile',
      icon: 'person',
      route: '/teacher/profile'
    },
    {
      title: 'Settings',
      icon: 'settings',
      route: '/teacher/settings'
    }
  ]);

}