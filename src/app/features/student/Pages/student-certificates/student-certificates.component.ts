import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { ToastService } from '../../../../core/services/toast.service';
import { CertificateDocumentComponent } from '../../../Course/Components/certificate-document/certificate-document.component';
import { ICertificate } from '../../../Course/Models/certificate.interface';
import { CertificatePdfService } from '../../../Course/Services/certificate-pdf.service';
import { CourseService } from '../../../Course/Services/course.service';
import { CertificateGalleryCardComponent } from '../../Components/certificate-gallery-card/certificate-gallery-card.component';

@Component({
  selector: 'app-student-certificates',
  standalone: true,
  imports: [
    RouterLink,
    CertificateDocumentComponent,
    CertificateGalleryCardComponent,
  ],
  templateUrl: './student-certificates.component.html',
  styleUrl: './student-certificates.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCertificatesComponent implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly pdfService = inject(CertificatePdfService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  readonly certificates = signal<ICertificate[]>([]);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  readonly downloadingCertificateId = signal<string | null>(null);
  readonly selectedCertificateForExport = signal<ICertificate | null>(null);
  readonly certificateCount = computed(() => this.certificates().length);
  readonly skeletonItems = [1, 2, 3, 4, 5, 6] as const;

  @ViewChild(CertificateDocumentComponent)
  private exportDocument?: CertificateDocumentComponent;

  ngOnInit(): void {
    this.loadCertificates();
  }

  loadCertificates(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.courseService
      .getCertificates()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (certificates) => this.certificates.set(certificates),
        error: () => {
          this.certificates.set([]);
          this.hasError.set(true);
        },
      });
  }

  async downloadCertificate(certificate: ICertificate): Promise<void> {
    if (this.downloadingCertificateId()) {
      return;
    }

    this.downloadingCertificateId.set(certificate.certificateId);
    this.selectedCertificateForExport.set(certificate);

    try {
      this.changeDetectorRef.detectChanges();
      await this.waitForRender();

      const element = this.exportDocument?.element;
      if (!element) {
        throw new Error('Certificate export document is unavailable.');
      }

      await this.pdfService.download(
        element,
        certificate.courseTitle,
        certificate.courseId,
      );
    } catch {
      this.toastService.show('تعذر تحميل الشهادة. حاول مرة أخرى.', 'error');
    } finally {
      this.selectedCertificateForExport.set(null);
      this.downloadingCertificateId.set(null);
    }
  }

  private waitForRender(): Promise<void> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  }
}
