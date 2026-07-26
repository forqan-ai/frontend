import {
  AfterViewInit,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentSidebarComponent } from '../../../student/Components/student-sidebar/student-sidebar.component';
import { pointPakcage } from '../../models/PointPackages';
import { PointsService } from '../../services/points.service';
import { PaymentService } from '../../../../core/services/payment.service';

declare const Pixel: new (options: PixelOptions) => void;

interface PixelOptions {
  publicKey: string;
  clientSecret: string;
  paymentMethods: string[];
  elementId: string;
  showSaveCard?: boolean;
  forceSaveCard?: boolean;
  afterPaymentComplete?: (response: unknown) => void;
  customStyle?: Record<string, string>;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [StudentSidebarComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements AfterViewInit {
  readonly route = inject(ActivatedRoute);
  readonly pointsService = inject(PointsService);
  readonly paymentService = inject(PaymentService);
  readonly router = inject(Router);

  package = signal<pointPakcage | null>(null);

  private pointPackageId!: string;

  ngAfterViewInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if (!id) {
          console.error('Package Id not found');
          return;
        }

        this.pointPackageId = id;

        this.loadPackage();

        this.initializePayment();
      },
    });
  }

  private loadPackage(): void {
    this.pointsService.getPointPackage(this.pointPackageId).subscribe({
      next: (res) => {
        this.package.set(res.data);
      },
      error: (err) => {
        console.error('Failed to load package', err);
      },
    });
  }

  private initializePayment(): void {
    this.paymentService
      .createPayment(
        'PointPackage',
        undefined,
        this.pointPackageId
      )
      .subscribe({
        next: (res) => {
          new Pixel({
            publicKey: res.data.publicKey,
            clientSecret: res.data.clientSecret,

            paymentMethods: ['card'],

            elementId: 'paymob-elements',

            showSaveCard: true,

            forceSaveCard: false,

            customStyle: {
              Color_Primary: '#5A2E23',
              Color_Border_Payment_Button: '#5A2E23',
            },

            afterPaymentComplete: (response) => {
              console.log('Payment Response:', response);

              this.router.navigate([
                '/payment-processing',
                res.data.PaymentId,
              ]);
            },
          });
        },
        error: (err) => {
          console.error('Failed to initialize payment', err);
        },
      });
  }
}