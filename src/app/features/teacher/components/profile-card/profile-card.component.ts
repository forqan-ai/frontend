import { Component, input } from '@angular/core';
import { TeacherProfile } from '../../models/teacher-profile.model';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css'
})
export class ProfileCardComponent {

  teacher = input<TeacherProfile | null>(null);

}