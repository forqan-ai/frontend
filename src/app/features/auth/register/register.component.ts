import {
  Component,
  ElementRef,
  inject,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  ViewChild,
} from '@angular/core';

import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../../../core/models/auth.models';
import { CommonModule } from '@angular/common';
import { GoogleAuthService } from '../../../core/services/google-auth.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly googleService = inject(GoogleAuthService);

  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly errorMessage = signal<string | null>(null);

  @ViewChild('googleButton', { static: true })
  googleButton!: ElementRef<HTMLDivElement>;

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],

    email: ['', [Validators.required, Validators.email]],

    password: ['', [
      Validators.required,
      Validators.minLength(8),
    ]],

    confirmPassword: ['', [
      Validators.required,
    ]],

    acceptTerms: [false, [
      Validators.requiredTrue,
    ]],

    gender: ['', [
      Validators.required,
    ]],
  });

  ngAfterViewInit(): void {
    this.googleService.initialize(
      environment.auth.googleClientId,
      this.handleCredentialResponse.bind(this),
    );

    this.googleService.renderButton(
      this.googleButton.nativeElement,
    );

    this.googleService.prompt();
  }

  private handleCredentialResponse(response: any): void {
    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    if (!response?.credential) {
      this.isSubmitting.set(false);

      this.errorMessage.set(
        'فشل الحصول على بيانات تسجيل الدخول من Google.',
      );

      return;
    }

    console.log('Google Response:', response);

    this.authService.googleLogin(response.credential).subscribe({
      next: () => {
        this.isSubmitting.set(false);

        this.router.navigate(['/']);
      },

      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);

        const apiErrors = err?.error?.errors as ApiError[] | undefined;

        this.errorMessage.set(
          apiErrors?.[0]?.description ??
          err?.error?.message ??
          'حدث خطأ أثناء تسجيل الدخول بواسطة Google.',
        );
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((value) => !value);
  }

  onSubmit(): void {
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const {
      fullName,
      email,
      password,
      confirmPassword,
      gender,
    } = this.form.getRawValue();

    this.authService.register({
      fullName,
      email,
      password,
      confirmPassword,
      gender,
    }).subscribe({
      next: (response) => {
        console.log('Register Response:', response);

        this.isSubmitting.set(false);

        this.router.navigate(['/check-email']);
      },

      error: (err: HttpErrorResponse) => {
        console.error('Register Error:', err);

        this.isSubmitting.set(false);

        const apiErrors = err?.error?.errors as ApiError[] | undefined;

        this.errorMessage.set(
          apiErrors?.[0]?.description ??
          err?.error?.message ??
          'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى.',
        );
      },
    });
  }

  get fullName() {
    return this.form.controls.fullName;
  }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  get confirmPassword() {
    return this.form.controls.confirmPassword;
  }

  get acceptTerms() {
    return this.form.controls.acceptTerms;
  }

  get gender() {
    return this.form.controls.gender;
  }
}