import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';

import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { environment } from '../../../../environments/environment.development';

import { AuthService } from '../../../core/services/auth.service';
import { GoogleAuthService } from '../../../core/services/google-auth.service';

import {
  ApiError,
  LoginRequest,
  Role,
} from '../../../core/models/auth.models';
import { SettingsService } from '../../student/Services/settings.service';

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: unknown;
      };
    };
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly googleService = inject(GoogleAuthService);
  private readonly router = inject(Router);

  @ViewChild('googleButton', { static: true })
  googleButton!: ElementRef<HTMLElement>;

  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
      ],
    ],
    rememberMe: [false],
  });

  async ngAfterViewInit(): Promise<void> {
    try {
      await this.googleService.initialize(
        environment.auth.googleClientId,
        this.handleCredentialResponse.bind(this)
      );

      this.googleService.renderButton(
        this.googleButton.nativeElement
      );

      this.googleService.prompt();
    } catch (error) {
      console.error(
        'Google initialization failed:',
        error
      );
    }
  }

  private handleCredentialResponse(
    response: any
  ): void {
    this.clearErrors();
    this.isSubmitting.set(true);

    this.authService
      .googleLogin(response.credential)
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);

          if (res.succeeded) {
            this.navigateByRole();
            return;
          }

          this.handleApiErrors(
            res.errors as ApiError[]
          );
        },

        error: (err: HttpErrorResponse) => {
          this.isSubmitting.set(false);

          this.handleApiErrors(
            err.error?.errors as ApiError[]
          );
        },
      });
  }

  togglePassword(): void {
    this.showPassword.update(
      (value) => !value
    );
  }


  settingsService = inject(SettingsService);
  onSubmit(): void {
    this.clearErrors();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const request: LoginRequest = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
      rememberMe: this.form.controls.rememberMe.value,
    };

    this.authService
      .login(request)
      .subscribe({
        next: (res) => {
          this.settingsService.setUser(res.data.user);
          this.isSubmitting.set(false);
          if (res.succeeded) {
            if (this.authService.hasRole(Role.Teacher)) {
              this.router.navigate(['/teacher']);
            } else if (this.authService.hasRole(Role.Student)) {
              this.router.navigate(['/student/home']);
            } else if (this.authService.hasRole(Role.Admin)) {
              this.router.navigate(['/admin/teaching-requests']);
            }
          } else {
            const apiError = res.errors as ApiError[];

            this.errorMessage.set(
              apiError[0]?.description ??
              'حدث خطأ أثناء تسجيل الدخول.'
            );
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.handleApiErrors(
            err.error?.errors as ApiError[]
          );
        },
      });
  }

  private handleApiErrors(
    errors?: ApiError[]
  ): void {
    if (!errors?.length) {
      this.errorMessage.set(
        'حدث خطأ أثناء تسجيل الدخول.'
      );

      return;
    }

    let hasFieldError = false;

    for (const error of errors) {
      const code = (
        error as ApiError & { code?: string }
      ).code?.toLowerCase();

      const description =
        error.description;

      if (!description) {
        continue;
      }

      if (
        code?.includes('email') ||
        code?.includes('username')
      ) {
        this.email.setErrors({
          backend: description,
        });

        hasFieldError = true;
        continue;
      }

      if (
        code?.includes('password')
      ) {
        this.password.setErrors({
          backend: description,
        });

        hasFieldError = true;
        continue;
      }

      this.errorMessage.set(
        description
      );
    }

    if (
      !hasFieldError &&
      !this.errorMessage()
    ) {
      this.errorMessage.set(
        errors[0]?.description ??
        'حدث خطأ أثناء تسجيل الدخول.'
      );
    }
  }

  private clearErrors(): void {
    this.errorMessage.set(null);

    this.email.setErrors(null);
    this.password.setErrors(null);
  }

  private navigateByRole(): void {
    if (
      this.authService.hasRole(Role.Teacher)
    ) {
      this.router.navigate([
        '/teacher',
      ]);

      return;
    }

    if (
      this.authService.hasRole(Role.Student)
    ) {
      this.router.navigate([
        '/dashboard/student/home',
      ]);

      return;
    }

    if (
      this.authService.hasRole(Role.Admin)
    ) {
      this.router.navigate([
        '/dashboard/admin/teaching-requests',
      ]);
    }
  }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  get rememberMe() {
    return this.form.controls.rememberMe;
  }
}