import { Component, input, output } from '@angular/core';
import { TeacherProfile } from '../../models/teacher-profile.model';

@Component({
  selector: 'app-profile-summary',
  imports: [],
  templateUrl: './profile-summary.component.html',
  styleUrl: './profile-summary.component.css',
})
export class ProfileSummaryComponent {
  teacher = input<TeacherProfile | null>(null);
  previewUrl: string | null = null;

  imageSelected = output<File>();
  onSelect(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];

    this.previewUrl = URL.createObjectURL(file);

    this.imageSelected.emit(file);
  }
}
