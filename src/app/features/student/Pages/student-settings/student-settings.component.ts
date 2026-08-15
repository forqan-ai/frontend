import { Component, OnInit, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { ToastService } from '../../../../core/services/toast.service';

import { IUserSettings, ChangePasswordRequest } from '../../Models/settings.interface';

import { SettingsService } from '../../Services/settings.service';

import { ButtonComponent } from '../../../../shared/components/button/button.component';

import { ToastComponent } from '../../../../shared/components/toast/toast.component';

import { RouterLink } from '@angular/router';

function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value ?? '';

  const hasUpperCase = /[A-Z]/.test(value);

  const hasLowerCase = /[a-z]/.test(value);

  const hasDigit = /[0-9]/.test(value);

  const hasSpecialChar = /[^a-zA-Z0-9]/.test(value);

  const valid = hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;

  return valid ? null : { weakPassword: true };
}

const samePasswordValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const currentPassword = group.get('currentPassword')?.value;

  const newPassword = group.get('newPassword')?.value;

  if (currentPassword && newPassword && currentPassword === newPassword) {
    return {
      samePassword: true,
    };
  }

  return null;
};

@Component({
  selector: 'app-settings',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, RouterLink],

  templateUrl: './student-settings.component.html',

  styleUrls: ['./student-settings.component.css'],
})
export class StudentSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);

  private settingsService = inject(SettingsService);

  private toast = inject(ToastService);

  loading = signal(false);

  imagePreview = signal<string | null>(null);

  openSection = signal<string | null>('profile');

  user = this.settingsService.user;

  selectedFile: File | null = null;

  profileForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
  });

  passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: ['', Validators.required],

      newPassword: ['', [Validators.required, Validators.minLength(6), strongPasswordValidator]],
    },

    {
      validators: samePasswordValidator,
    },
  );

  ngOnInit(): void {
    this.loadUser();
  }

  toggleSection(section: string) {
    this.openSection.update((current) => (current === section ? null : section));
  }

  loadUser() {
    this.loading.set(true);

    this.settingsService.getSettings().subscribe({
      next: (res) => {
        this.settingsService.setUser(res);

        this.profileForm.patchValue({
          fullName: res.fullName,
        });

        this.imagePreview.set(res.profileImageURL);

        this.loading.set(false);
      },

      error: () => {
        this.loading.set(false);

        this.toast.show('حدث خطأ أثناء تحميل البيانات', 'error');
      },
    });
  }

  // onImageSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;

  //   if (!input.files || input.files.length === 0) {
  //     return;
  //   }

  //   this.selectedFile = input.files[0];

  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     this.imagePreview.set(reader.result as string);
  //   };

  //   reader.readAsDataURL(this.selectedFile);
  // }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();

      this.toast.show('من فضلك أدخل الاسم', 'error');

      return;
    }

    const fullName = this.profileForm.getRawValue().fullName;

    const currentUser = this.user();

    const currentName = currentUser?.fullName ?? '';

    const currentImage = currentUser?.profileImageURL ?? null;

    const nameChanged = fullName.trim() !== currentName.trim();

    const imageChanged = this.selectedFile !== null;

    if (!nameChanged && !imageChanged) {
      this.toast.show('لم يتم إجراء أي تعديل', 'error');

      return;
    }

    this.loading.set(true);

    this.settingsService.createProfileChangeRequest(fullName, this.selectedFile).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.show('تم إرسال طلب تعديل البيانات إلى الإدارة للمراجعة');
        this.selectedFile = null;
      },

      error: (err) => {
        this.loading.set(false);

        const message =
          err.error?.errorMessage ||
          err.error?.errors?.[0]?.description ||
          err.error?.message ||
          'حدث خطأ أثناء إرسال طلب التعديل';

        this.toast.show(message, 'error');
      },
    });
  }

  changePassword() {
    if (this.passwordForm.hasError('samePassword')) {
      this.toast.show('كلمة المرور الجديدة لازم تختلف عن الحالية', 'error');

      return;
    }

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();

      this.toast.show('تأكد من إدخال البيانات وتوافقها مع الشروط', 'error');

      return;
    }

    this.loading.set(true);

    const body: ChangePasswordRequest = this.passwordForm.getRawValue();

    this.settingsService.changePassword(body).subscribe({
      next: () => {
        this.loading.set(false);

        this.passwordForm.reset({
          currentPassword: '',
          newPassword: '',
        });

        this.toast.show('تم تغيير كلمة المرور بنجاح');
      },

      error: (err) => {
        this.loading.set(false);

        const error = err.error?.errors?.[0];

        if (error?.code === 'PasswordMismatch') {
          this.toast.show('كلمة المرور الحالية غير صحيحة', 'error');

          return;
        }

        this.toast.show(error?.description || 'حدث خطأ أثناء تغيير كلمة المرور', 'error');
      },
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.selectedFile = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };
    reader.readAsDataURL(this.selectedFile);
  }
}
