import {
  Component,
  inject, OnInit, signal,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';
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
  ) { }

  toastService = inject(ToastService);
  resendingEmail = signal<boolean>(false);
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.userEmail = params['email'] || sessionStorage.getItem('registeredEmail') || localStorage.getItem('registeredEmail') || '';
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
        this.toastService.show("تم الإرسال الي بريدك الإلكتروني")

      },
      error: (error) => {
        this.isResending = false;
        this.statusMessage = 'حدث خطأ أثناء إرسال الرابط، حاول مرة أخرى.';
        this.toastService.show("حدث خطأ, برجاء المحاولة مرة اخري", 'error')

      },
      complete: () => {
        this.resendingEmail.set(false);
      }
    });
  }
}