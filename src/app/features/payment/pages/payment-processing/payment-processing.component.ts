import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription, switchMap, takeWhile } from 'rxjs';
import { PaymentService } from '../../../../core/services/payment.service';


@Component({
  selector: 'app-payment-processing',
  standalone: true,
  imports: [],
  templateUrl: './payment-processing.component.html',
  styleUrl: './payment-processing.component.css',
})
export class PaymentProcessingComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentService = inject(PaymentService);

  paymentId!: string;
  timedOut = signal(false);

  private pollSub?: Subscription;
  private readonly POLL_INTERVAL_MS = 3000;
  private readonly MAX_ATTEMPTS = 40; // حوالي دقيقتين
  private attempts = 0;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('paymentId');

    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.paymentId = id;
    this.startPolling();
  }

  startPolling() {
    this.pollSub = interval(this.POLL_INTERVAL_MS)
      .pipe(
        switchMap(() => this.paymentService.getPaymentStatus(this.paymentId)),
        takeWhile(() => this.attempts < this.MAX_ATTEMPTS, true)
      )
      .subscribe({
        next: (res) => {
          this.attempts++;

          if (res.status === 'Success') {
            this.pollSub?.unsubscribe();
            this.router.navigate(['/payment-success', this.paymentId]);
          } else if (res.status === 'Failed') {
            this.pollSub?.unsubscribe();
            this.router.navigate(['/payment-failed', this.paymentId]);
          } else if (this.attempts >= this.MAX_ATTEMPTS) {
            this.timedOut.set(true);
            this.pollSub?.unsubscribe();
          }
        },
        error: (err) => {
          console.error('Polling error', err);
        },
      });
  }

  retryCheck() {
    this.attempts = 0;
    this.timedOut.set(false);
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }
}