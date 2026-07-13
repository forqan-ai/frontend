import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError, ExternalProvider } from '../../../core/models/auth.models';
import { CommonModule } from '@angular/common';
import { GoogleAuthService } from '../../../core/services/google-auth.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
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
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    acceptTerms: [false, [Validators.requiredTrue]],
    gender: ['', [Validators.required]],
  });

  ngAfterViewInit(): void {
    this.googleService.initialize(
      environment.auth.googleClientId,
      this.handleCredentialResponse.bind(this),
    );

    this.googleService.renderButton(this.googleButton.nativeElement);

    this.googleService.prompt();
  }

  private handleCredentialResponse(response: any): void {
    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    console.log('Google Response:', response);

    this.authService.googleLogin(response.credential).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);

        const apiError = err.error?.errors as ApiError[];

        this.errorMessage.set(
          apiError?.[0]?.description ?? 'حدث خطأ أثناء تسجيل الدخول بواسطة Google.',
        );
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  onSubmit(): void {
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const { fullName, email, password, confirmPassword,gender } = this.form.getRawValue();

    this.authService.register({ fullName, email, password, confirmPassword, gender }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/check-email']);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        const apiError = err.error.errors as ApiError[];

        this.errorMessage.set(
          apiError[0]?.description ?? 'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى.',
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
