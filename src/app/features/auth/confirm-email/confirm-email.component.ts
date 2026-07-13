import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'];
      const token = params['token'];

      if (userId && token) {
        this.confirmUserEmail(userId, token);
      } else {
        this.status = 'error';
        this.errorMessage = 'رابط التفعيل غير صالح.';
      }
    });
  }

confirmUserEmail(userId: string, token: string) {
    const apiUrl = 'https://localhost:7054/api/auth/confirm-email';
    const params = new HttpParams().set('userId', userId).set('token', token);
    this.http.get(apiUrl, { params }).subscribe({
      next: (response) => {
        console.log('API Response Success:', response);
        this.status = 'success';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.status = 'error';
        this.errorMessage = 'فشل تفعيل الحساب.';
        this.cdr.detectChanges();
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
