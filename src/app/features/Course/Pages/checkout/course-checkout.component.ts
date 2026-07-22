import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../Services/course.service';
import { ICourseDetailsDto } from '../../Models/course-details-dto.interface';
import { PaymentService } from '../../../../core/services/payment.service';
import { StudentSidebarComponent } from '../../../student/Components/student-sidebar/student-sidebar.component';

declare const Pixel: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, StudentSidebarComponent],
  templateUrl: './course-checkout.component.html',
  styleUrl: './course-checkout.component.css',
})
export class CourseCheckoutComponent {

  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private paymentService = inject(PaymentService);

  course = signal<ICourseDetailsDto | null>(null);

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const id = params.get('id');

      if (!id) return;

      this.courseService.getCourseDetails(id).subscribe({
        next: res => this.course.set(res),
        error: console.error
      });

      this.paymentService.createPayment('Course', id).subscribe({

        next: res => {

          new Pixel({

            publicKey: res.data.publicKey,

            clientSecret: res.data.clientSecret,

            paymentMethods: ['card'],

            elementId: 'paymob-elements',

            showSaveCard: true,

            forceSaveCard: false,

            afterPaymentComplete: (response: any) => {
              console.log(response);
            }

          });

        },

        error: console.error

      });

    });

  }

}