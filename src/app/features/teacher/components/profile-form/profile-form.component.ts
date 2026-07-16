import { Component, input, output, effect, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { TeacherProfile } from '../../models/teacher-profile.model';
import { UpdateTeacherProfile } from '../../models/update-teacher-profile.model';

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

  save = output<UpdateTeacherProfile>();

  form = this.fb.group({
    fullName: [''],

    email: [{ value: '', disabled: true }],

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
    if (this.form.invalid) return;

    this.save.emit({
      fullName: this.form.getRawValue().fullName ?? '',

      bio: this.form.getRawValue().bio ?? '',
    });
  }


}
