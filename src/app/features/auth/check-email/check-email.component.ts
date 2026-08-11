import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-check-email',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './check-email.component.html',
  styleUrl: './check-email.component.css',
})
export class CheckEmailComponent implements OnInit {
  userEmail: string = '';
  statusMessage: string = '';
  isResending: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.userEmail = params['email'] || sessionStorage.getItem('registeredEmail') || '';
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  resendActivationEmail() {
    if (!this.userEmail || this.isResending) return;

    this.isResending = true;
    this.statusMessage = '';

    const payload = { email: this.userEmail };
    this.http.post(`${environment.apiUrl}/api/auth/resend-confirmation-email`, payload).subscribe({
      next: (response) => {
        this.isResending = false;
        this.statusMessage = 'تم إرسال رابط التفعيل بنجاح، تحقق من بريدك الإلكتروني.';
      },
      error: (error) => {
        this.isResending = false;
        this.statusMessage = 'حدث خطأ أثناء إرسال الرابط، حاول مرة أخرى.';
      },
    });
  }
}