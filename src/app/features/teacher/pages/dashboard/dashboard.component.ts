import { Component, inject, OnInit, signal } from '@angular/core';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { StatisticsComponent } from '../../components/statistics/statistics.component';
import { QuickActionsComponent } from '../../components/quick-actions/quick-actions.component';

import { TeacherService } from '../../services/teacher.service';

import { TeacherDashboard } from '../../models/teacher-dashboard.model';
import { TeacherProfile } from '../../models/teacher-profile.model';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    ProfileCardComponent,
    StatisticsComponent,
    QuickActionsComponent,
    // RecentCoursesComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private teacherService = inject(TeacherService);

  dashboard = signal<TeacherDashboard | null>(null);

  profile = signal<TeacherProfile | null>(null);

  sidebarOpen = signal(false);

  toggleSidebar() {
    console.log('menu clicked');
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
  ngOnInit(): void {
    this.loadDashboard();

    this.loadProfile();
  }

  loadDashboard() {
    this.teacherService.getDashboard().subscribe({
      next: (res) => this.dashboard.set(res),

      error: console.error,
    });
  }

  loadProfile() {
    this.teacherService.getProfile().subscribe({
      next: (res) => this.profile.set(res),

      error: console.error,
    });
  }
}
