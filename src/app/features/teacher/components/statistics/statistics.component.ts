import { Component, input } from '@angular/core';
import { TeacherDashboard } from '../../models/teacher-dashboard.model';

@Component({
  selector: 'app-statistics',
  standalone: true,
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {

  dashboard = input<TeacherDashboard | null>(null);

}