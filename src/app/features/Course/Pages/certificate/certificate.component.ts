import {
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

// import html2pdf from 'html2pdf.js';

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

  async downloadPdf(): Promise<void> {
    // //only download the package when needed
    // const { default: html2pdf } = await import('html2pdf.js');

    // const options = {
    //   margin: [20, 0, 0, 0] as [number, number, number, number],
    //   filename: 'Furqan-Certificate.pdf',

    //   image: {
    //     type: 'jpeg' as const,
    //     quality: 1,
    //   },

    //   html2canvas: {
    //     scale: 3,
    //     useCORS: true,
    //   },

    //   jsPDF: {
    //     unit: 'mm' as const,
    //     format: 'a4' as const,
    //     orientation: 'landscape' as const,
    //   },
    // };
    //  html2pdf()
    //   .set(options)
    //   .from(this.certificateRef.nativeElement)
    //   .save();



    // const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    //   import('html2canvas'),
    //   import('jspdf'),
    // ]);
    // const canvas = await html2canvas(this.certificateRef.nativeElement, {
    //   scale: 2,
    //   useCORS: true,
    // });

    // const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // const pdf = new jsPDF({
    //   orientation: 'landscape',
    //   unit: 'mm',
    //   format: 'a4',
    // });

    // pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
    // pdf.save('Furqan-Certificate.pdf');


    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const element = this.certificateRef.nativeElement;

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const pdfWidth = 297;
    const pdfHeight = 210;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const certificateRatio = canvas.width / canvas.height;
    const pdfRatio = pdfWidth / pdfHeight;

    let width: number;
    let height: number;
    let x: number;
    let y: number;

    if (certificateRatio > pdfRatio) {
      width = pdfWidth;
      height = width / certificateRatio;
      x = 0;
      y = (pdfHeight - height) / 2;
    } else {
      height = pdfHeight;
      width = height * certificateRatio;
      x = (pdfWidth - width) / 2;
      y = 0;
    }

    pdf.addImage(
      imgData,
      'JPEG',
      x,
      y,
      width,
      height,
      undefined,
      'FAST'
    );

    pdf.save('Furqan-Certificate.pdf');



  }
}