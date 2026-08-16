import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ICertificate } from '../../../Course/Models/certificate.interface';

@Component({
  selector: 'app-certificate-gallery-card',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './certificate-gallery-card.component.html',
  styleUrl: './certificate-gallery-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateGalleryCardComponent {
  readonly certificate = input.required<ICertificate>();
  readonly downloading = input(false);
  readonly downloadDisabled = input(false);
  readonly downloadRequested = output<ICertificate>();

  readonly teacherName = computed(
    () => this.certificate().teacherName?.trim() || 'غير متوفر',
  );

  requestDownload(): void {
    if (!this.downloadDisabled()) {
      this.downloadRequested.emit(this.certificate());
    }
  }
}
