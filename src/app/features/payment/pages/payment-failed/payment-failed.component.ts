import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-failed',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payment-failed.component.html',
  styleUrl: './payment-failed.component.css',
})
export class PaymentFailedComponent {
  private router = inject(Router);

  retryPayment() {
    this.router.navigate(['/courses']);
  }
}