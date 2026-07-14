import { Component, input } from '@angular/core';
import { TeacherProfile } from '../../models/teacher-profile.model';

@Component({
  selector: 'app-profile-summary',
  imports: [],
  templateUrl: './profile-summary.component.html',
  styleUrl: './profile-summary.component.css',
})
export class ProfileSummaryComponent {
    teacher = input<TeacherProfile | null>(null);
}
