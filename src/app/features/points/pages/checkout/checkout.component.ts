import { Component, inject, Input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { pointPakcage } from '../../models/PointPackages';
import { ActivatedRoute, Router } from '@angular/router';
import { PointsService } from '../../services/points.service';
import { PaymentService } from '../../../../core/services/payment.service';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  route = inject(ActivatedRoute);
  pointPakcageId = this.route.snapshot.paramMap.get('id');
  package = signal<pointPakcage | null>(null);
  private sanitizer = inject(DomSanitizer);
  readonly poService = inject(PointsService);
  readonly payService = inject(PaymentService);

  paymentUrl = signal<SafeResourceUrl>(
    this.sanitizer.bypassSecurityTrustResourceUrl(
      '',
    ),
  );

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) return;

      this.poService.getPointPackage(id).subscribe({
        next: (res) => this.package.set(res.data),
        error: console.error,
      });
    });

    this.payService
      .createPayment('PointPackage', undefined, this.pointPakcageId ?? undefined)
      .subscribe({
        next: (url) => {
          console.log(this.pointPakcageId);
          console.log(url.data);
          this.paymentUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url.data.checkoutUrl));
          window.top!.location.href = url.data.checkoutUrl;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
