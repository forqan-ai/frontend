import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  input,
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { ICertificate } from '../../Models/certificate.interface';

@Component({
  selector: 'app-certificate-document',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './certificate-document.component.html',
  styleUrl: './certificate-document.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateDocumentComponent {
  readonly certificate = input.required<ICertificate>();
  readonly teacherName = computed(
    () => this.certificate().teacherName?.trim() || 'غير متوفر',
  );

  @ViewChild('certificateElement', { static: true })
  private readonly certificateElement!: ElementRef<HTMLDivElement>;

  get element(): HTMLDivElement {
    return this.certificateElement.nativeElement;
  }
}
