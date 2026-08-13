import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ICertificate } from '../../../Course/Models/certificate.interface';
import { CertificateGalleryCardComponent } from './certificate-gallery-card.component';

describe('CertificateGalleryCardComponent', () => {
  const certificate: ICertificate = {
    certificateId: 'certificate-1',
    courseId: 'course-1',
    studentName: 'محمود أحمد',
    courseTitle: 'أحكام التجويد',
    teacherName: '',
    issuedAt: '2026-08-10T00:00:00Z',
    verificationCode: 'FRQ-82X9K7',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CertificateGalleryCardComponent],
      providers: [provideRouter([])],
    });
  });

  it('links to the full certificate and renders the teacher fallback', () => {
    const fixture = TestBed.createComponent(CertificateGalleryCardComponent);
    fixture.componentRef.setInput('certificate', certificate);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const previewLink = element.querySelector<HTMLAnchorElement>('.preview-link');

    expect(previewLink?.getAttribute('href')).toBe(
      '/dashboard/student/certificate/course-1',
    );
    expect(element.querySelector('.teacher-name')?.textContent).toContain('غير متوفر');
  });

  it('emits the certificate only while download is enabled', () => {
    const fixture = TestBed.createComponent(CertificateGalleryCardComponent);
    fixture.componentRef.setInput('certificate', certificate);
    fixture.detectChanges();

    let emittedCertificate: ICertificate | undefined;
    fixture.componentInstance.downloadRequested.subscribe(
      (value) => (emittedCertificate = value),
    );

    const downloadButton = fixture.nativeElement.querySelector(
      '.download-button',
    ) as HTMLButtonElement;
    downloadButton.click();
    expect(emittedCertificate).toEqual(certificate);

    emittedCertificate = undefined;
    fixture.componentRef.setInput('downloadDisabled', true);
    fixture.detectChanges();
    downloadButton.click();
    expect(emittedCertificate).toBeUndefined();
    expect(downloadButton.disabled).toBe(true);
  });
});
