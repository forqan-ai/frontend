import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { retry } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models/auth.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isPasswordVisible: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authservice: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form Data:', this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }

    const credentials: LoginRequest = {
      email: this.email.value,
      password: this.password.value,
    };
    this.authservice.login(credentials).subscribe({
      next: (response) => {
        localStorage.setItem('DeniToken', response.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Basic backend error processing wrapper
        this.errorMessage = err.error?.message || 'حدث خطأ ما أثناء التسجيل، يرجى المحاولة لاحقاً.';
        console.error('Registration error:', err);
      },
    });
  }

  get password() {
    return this.loginForm.controls['password'];
  }
  get email() {
    return this.loginForm.controls['email'];
  }
}
