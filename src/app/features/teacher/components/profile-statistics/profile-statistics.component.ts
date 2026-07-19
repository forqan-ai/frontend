import { Component, input } from '@angular/core';
import { TeacherDashboard } from '../../models/teacher-dashboard.model';

@Component({
  selector: 'app-profile-statistics',
  standalone: true,
  templateUrl: './profile-statistics.component.html',
  styleUrl: './profile-statistics.component.css'
})
export class ProfileStatisticsComponent {

  dashboard=input<TeacherDashboard|null>(null);

}