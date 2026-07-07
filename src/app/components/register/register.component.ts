import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isPasswordVisible = false;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],

      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required, Validators.minLength(8)]],

      acceptTerms: [false, Validators.requiredTrue],
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Map form value to model format (excluding acceptTerms since backend doesn't save it)
    const registerData: RegisterRequest = {
      fullName: this.fullName.value,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registration success:', response);
        // Save token or redirect user to dashboard/login
        localStorage.setItem('DeniToken', response.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        // Basic backend error processing wrapper
        this.errorMessage = err.error?.message || 'حدث خطأ ما أثناء التسجيل، يرجى المحاولة لاحقاً.';
        console.error('Registration error:', err);
      },
    });
  }

  get fullName() {
    return this.registerForm.controls['fullName'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get acceptTerms() {
    return this.registerForm.controls['acceptTerms'];
  }
}
