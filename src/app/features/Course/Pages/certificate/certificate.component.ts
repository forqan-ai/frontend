import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { ToastService } from '../../../../core/services/toast.service';
import { CertificateDocumentComponent } from '../../Components/certificate-document/certificate-document.component';
import { ICertificate } from '../../Models/certificate.interface';
import { CertificatePdfService } from '../../Services/certificate-pdf.service';
import { CourseService } from '../../Services/course.service';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CertificateDocumentComponent],
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);
  private readonly pdfService = inject(CertificatePdfService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly courseId = this.route.snapshot.paramMap.get('courseId') ?? '';

  readonly certificate = signal<ICertificate | null>(null);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  readonly isDownloading = signal(false);

  @ViewChild(CertificateDocumentComponent)
  private readonly certificateDocument?: CertificateDocumentComponent;

  ngOnInit(): void {
    this.loadCertificate();
  }

  loadCertificate(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.courseService
      .getCertificate(this.courseId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (certificate) => this.certificate.set(certificate),
        error: () => {
          this.certificate.set(null);
          this.hasError.set(true);
        },
      });
  }

  async downloadPdf(): Promise<void> {
    const certificate = this.certificate();
    const element = this.certificateDocument?.element;

    if (!certificate || !element || this.isDownloading()) {
      return;
    }

    this.isDownloading.set(true);
    try {
      await this.pdfService.download(
        element,
        certificate.courseTitle,
        certificate.courseId,
      );
    } catch {
      this.toastService.show('تعذر تحميل الشهادة. حاول مرة أخرى.', 'error');
    } finally {
      this.isDownloading.set(false);
    }
  }
}
