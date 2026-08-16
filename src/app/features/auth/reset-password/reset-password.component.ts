import {
  Component,
  OnInit,
  ChangeDetectorRef,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { environment } from '../../../../environments/environment.development';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  isResetMode = false;

  emailSent = false;

  status: 'idle' | 'loading' | 'success' | 'error' = 'idle';

  errorMessage = '';

  email = '';
  newPassword = '';
  confirmPassword = '';
  token = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      const urlEmail = params['email'];
      let urlToken = params['token'];

      if (urlEmail && urlToken) {

        this.email = urlEmail;

        this.token = urlToken.replace(/ /g, '+');

        this.isResetMode = true;

        this.emailSent = false;

      } else {

        this.isResetMode = false;

        this.emailSent = false;

      }

    });

  }

  handleForgotPassword(): void {

    if (!this.email) {

      this.status = 'error';

      this.errorMessage =
        'الرجاء إدخال البريد الإلكتروني.';

      return;
    }

    this.status = 'loading';

    this.emailSent = false;

    const apiUrl =
      `${environment.apiUrl}/api/auth/forgot-password`;

    this.http.post(apiUrl, {
      email: this.email
    }).subscribe({

      next: () => {

        this.status = 'success';

        this.emailSent = true;

        this.cdr.detectChanges();

      },

   error: (err) => {
  console.error('RESET PASSWORD ERROR:', err);
  console.error('ERROR BODY:', err.error);

  this.status = 'error';

  this.errorMessage =
    err.error?.message ||
    err.error?.errors?.[0]?.description ||
    'فشل إعادة تعيين كلمة المرور، قد يكون الرابط منتهي الصلاحية.';

  this.cdr.detectChanges();
}

    });

  }

  handleResetPassword(): void {

  if (!this.newPassword || !this.confirmPassword) {
    this.status = 'error';
    this.errorMessage = 'الرجاء ملء جميع الحقول.';
    return;
  }

  if (this.newPassword !== this.confirmPassword) {
    this.status = 'error';
    this.errorMessage = 'كلمتا المرور غير متطابقتين.';
    return;
  }

  this.status = 'loading';

  const apiUrl = `${environment.apiUrl}/api/auth/reset-password`;

  const payload = {
    email: this.email,
    token: this.token,
    newPassword: this.newPassword
  };

  console.log('RESET PASSWORD PAYLOAD:', {
    email: this.email,
    token: this.token,
    newPassword: this.newPassword
  });

  this.http.post(apiUrl, payload).subscribe({

    next: (response) => {

      console.log('RESET PASSWORD SUCCESS:', response);

      this.status = 'success';

      this.cdr.detectChanges();
    },

    error: (err) => {

      console.error('RESET PASSWORD ERROR:', err);
      console.error('ERROR BODY:', err.error);

      this.status = 'error';

      this.errorMessage =
        err.error?.message ||
        err.error?.errors?.[0]?.description ||
        'فشل إعادة تعيين كلمة المرور، قد يكون الرابط منتهي الصلاحية.';

      this.cdr.detectChanges();
    }

  });
}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

}