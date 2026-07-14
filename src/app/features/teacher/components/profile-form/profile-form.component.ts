import { Component, input, output, effect, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { TeacherProfile } from '../../models/teacher-profile.model';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css',
})
export class ProfileFormComponent {
  private fb = inject(FormBuilder);

  teacher = input<TeacherProfile | null>(null);

  save = output<any>();

  form = this.fb.group({
    fullName: [''],

    email: [''],

    bio: [''],
  });

  constructor() {
    effect(() => {
      const teacher = this.teacher();

      if (teacher) {
        this.form.patchValue({
          fullName: teacher.fullName,

          email: teacher.email,

          bio: teacher.bio,
        });
      }
    });
  }

  submit() {
    this.save.emit(this.form.getRawValue());
  }
}
