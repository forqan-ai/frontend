import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly googleService = inject(GoogleAuthService);
  private readonly router = inject(Router);

  @ViewChild('googleButton', { static: true })
  googleButton!: ElementRef<HTMLDivElement>;

  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false],
  });

  ngAfterViewInit(): void {
    this.googleService.initialize(
      environment.auth.googleClientId,
      this.handleCredentialResponse.bind(this)
    );

    this.googleService.renderButton(
      this.googleButton.nativeElement
    );

    this.googleService.prompt();
  }

  private handleCredentialResponse(response: any): void {
    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    console.log('Google Response:', response);

    this.authService
      .googleLogin(response.credential)
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);

          console.log(res);

          if (res.succeeded) {
            if (this.authService.hasRole(Role.Teacher)) {
              this.router.navigate(['/teacher']);
            } else {
              this.router.navigate(['/studentprofile']);
            }
          } else {
            const apiError = res.errors as ApiError[];

            this.errorMessage.set(
              apiError[0]?.description ??
              'Google login failed.'
            );
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting.set(false);

          console.error(err);

          const apiError = err.error?.errors as ApiError[];
          console.error(err.error);

          this.errorMessage.set(
            apiError?.[0]?.description ??
            'حدث خطأ أثناء تسجيل الدخول بواسطة Google.'
          );
        },
      });
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const request: LoginRequest = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
      rememberMe: this.form.controls.rememberMe.value
    };

    this.authService.login(request).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);

        if (res.succeeded) {
          if (this.authService.hasRole(Role.Teacher)) {
            this.router.navigate(['/teacher']);
          } else {
            this.router.navigate(['/dashboard/student/home']);
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

        const apiError = err.error?.errors as ApiError[];

        this.errorMessage.set(
          apiError?.[0]?.description ??
          'حدث خطأ أثناء تسجيل الدخول.'
        );
      },
    });
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
