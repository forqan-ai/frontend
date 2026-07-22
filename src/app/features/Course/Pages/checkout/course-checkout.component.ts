import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CourseService } from '../../Services/course.service';
import { ICourseDetailsDto } from '../../Models/course-details-dto.interface';
import { PaymentService } from '../../../../core/services/payment.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-checkout.component.html',
  styleUrl: './course-checkout.component.css',
})
export class CourseCheckoutComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private paymentService = inject(PaymentService);

  course = signal<ICourseDetailsDto | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  courseId!: string;

 ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');

  if (!id) {
    this.error.set('لم يتم تحديد الدورة المطلوبة.');
    return;
  }

  this.courseId = id;
  this.loadCourse();
}

  loadCourse() {
    this.loading.set(true);
    this.error.set(null);

    this.courseService.getCourseDetails(this.courseId).subscribe({
      next: (res) => {
        this.course.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.log('COURSE ERROR:', err);
        this.error.set('حدث خطأ أثناء تحميل بيانات الدورة.');
        this.loading.set(false);
      },
    });
  }

  pay() {
    this.loading.set(true);
    this.error.set(null);

    this.paymentService.createPayment('Course', this.courseId).subscribe({
      next: (res) => {
        if (res.succeeded && res.data.checkoutUrl) {
          // Redirect كامل لصفحة الدفع بدل Iframe
          // Paymob بيمنع التحميل جوه Iframe غالبًا لأسباب أمنية (3D Secure)
          window.location.href = res.data.checkoutUrl;
        } else {
          this.error.set('تعذر بدء عملية الدفع.');
          this.loading.set(false);
        }
      },
      error: (err) => {
        console.log('PAYMENT ERROR:', err);
        this.error.set(
          err?.error?.message ?? 'حدث خطأ أثناء بدء عملية الدفع.'
        );
        this.loading.set(false);
      },
    });
  }
}