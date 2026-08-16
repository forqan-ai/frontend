import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-failed',
  standalone: true,
  imports: [],
  templateUrl: './payment-failed.component.html',
  styleUrl: './payment-failed.component.css',
})
export class PaymentFailedComponent {
  private router = inject(Router);

  retryPayment() {
    this.router.navigate(['/courses']);
  }
}