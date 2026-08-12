import { Component, input } from '@angular/core';
import { TeacherDashboard } from '../../models/teacher-dashboard.model';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {

  dashboard = input<TeacherDashboard | null>(null);

}