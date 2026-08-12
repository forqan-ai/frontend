import { Component, input } from '@angular/core';
import { TeacherProfile } from '../../models/teacher-profile.model';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css'
})
export class ProfileCardComponent {

  teacher = input<TeacherProfile | null>(null);

}