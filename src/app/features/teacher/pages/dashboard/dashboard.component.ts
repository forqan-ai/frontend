import { Component, inject, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { StatisticsComponent } from '../../components/statistics/statistics.component';
import { QuickActionsComponent } from '../../components/quick-actions/quick-actions.component';


import { TeacherService } from '../../services/teacher.service';
import { TeacherProfile } from '../../models/teacher-profile.model';
import { TeacherDashboard } from '../../models/teacher-dashboard.model';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    ProfileCardComponent,
    StatisticsComponent,
    QuickActionsComponent,

  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  private teacherService = inject(TeacherService);

  profile = signal<TeacherProfile | null>(null);

  dashboard = signal<TeacherDashboard | null>(null);

  ngOnInit(): void {

    forkJoin({
      profile: this.teacherService.getProfile(),
      dashboard: this.teacherService.getDashboard()
    }).subscribe({

      next: (res) => {

        this.profile.set(res.profile);

        this.dashboard.set(res.dashboard);

      },

      error: console.error

    });

  }

}