import { Component, inject, OnInit, signal,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { StatisticsComponent } from '../../components/statistics/statistics.component';

import { TeacherService } from '../../services/teacher.service';

import { TeacherDashboard } from '../../models/teacher-dashboard.model';
import { TeacherProfile } from '../../models/teacher-profile.model';
import { PointsBalanceComponent } from '../../components/points-balance/points-balance.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [
    ProfileCardComponent,
    StatisticsComponent,
    PointsBalanceComponent,
    ScrollRevealDirective
  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private teacherService = inject(TeacherService);

  dashboard = signal<TeacherDashboard | null>(null);

  profile = signal<TeacherProfile | null>(null);

  dashboardLoading = signal(true);

  dashboardError = signal('');

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
    this.dashboardLoading.set(true);
    this.dashboardError.set('');

    this.teacherService.getDashboard().subscribe({
      next: (res) => {
        this.dashboard.set(res);
        this.dashboardLoading.set(false);
      },

      error: (error) => {
        console.error(error);
        this.dashboardError.set('تعذر تحميل إحصاءات لوحة المعلم.');
        this.dashboardLoading.set(false);
      },
    });
  }

  loadProfile() {
    this.teacherService.getProfile().subscribe({
      next: (res) => this.profile.set(res),
      error: console.error,
    });
  }
}
