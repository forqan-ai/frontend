import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ApiError, ExternalProvider } from '../../../core/models/auth.models';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal<string |null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false],
  });

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  onSubmit(): void {
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const { email, password } = this.form.getRawValue();

    this.authService
      .login({ email, password })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting.set(false);

          const apiError = err.error as ApiError | undefined;

          this.errorMessage.set(
            apiError?.detail ??
              'حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى.'
          );
        },
      });
  }

  loginWithProvider(provider: ExternalProvider): void {
    this.authService.loginWithProvider(provider);
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