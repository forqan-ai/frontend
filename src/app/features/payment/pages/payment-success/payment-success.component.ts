import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaymentService } from '../../../../core/services/payment.service';


@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css',
})
export class PaymentSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private paymentService = inject(PaymentService);

  paymentDetails = signal<any>(null);
  loading = signal(true);
  paymentId!: string;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('paymentId');

    if (!id) return;

    this.paymentId = id;
    this.loadDetails();
  }

  loadDetails() {
    this.paymentService.getPaymentDetails(this.paymentId).subscribe({
      next: (res) => {
        this.paymentDetails.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Payment details error', err);
        this.loading.set(false);
      },
    });
  }
}