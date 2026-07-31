import {
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import html2pdf from 'html2pdf.js';

import { CourseService } from '../../Services/course.service';
import { ICertificate } from '../../Models/certificate.interface';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.css',
})
export class CertificateComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);

  private readonly courseId =
    this.route.snapshot.paramMap.get('courseId')!;

  @ViewChild('certificateRef')
  certificateRef!: ElementRef<HTMLDivElement>;

  certificate = toSignal(
    this.courseService.getCertificate(this.courseId),
    {
      initialValue: {
        studentName: '',
        courseTitle: '',
        teacherName: '',
        issuedAt: '',
        verificationCode: '',
        logoUrl: '',
      } as ICertificate,
    }
  );

  downloadPdf(): void {
   const options = {
  margin: [20, 0, 0, 0] as [number, number, number, number],
  filename: 'Furqan-Certificate.pdf',

  image: {
    type: 'jpeg' as const,
    quality: 1,
  },

  html2canvas: {
    scale: 3,
    useCORS: true,
  },

  jsPDF: {
    unit: 'mm' as const,
    format: 'a4' as const,
    orientation: 'landscape' as const,
  },
};

    html2pdf()
      .set(options)
      .from(this.certificateRef.nativeElement)
      .save();
  }
}