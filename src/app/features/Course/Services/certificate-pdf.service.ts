import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({ providedIn: 'root' })
export class CertificatePdfService {
  async download(
    element: HTMLElement,
    courseTitle: string,
    courseId: string,
  ): Promise<void> {
    await this.waitForAssets(element);

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imageData = canvas.toDataURL('image/jpeg', 1.0);

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const canvasRatio = canvas.width / canvas.height;
    const pageRatio = pageWidth / pageHeight;

    let width = pageWidth;
    let height = pageHeight;
    let x = 0;
    let y = 0;

    if (canvasRatio > pageRatio) {
      height = pageWidth / canvasRatio;
      y = (pageHeight - height) / 2;
    } else {
      width = pageHeight * canvasRatio;
      x = (pageWidth - width) / 2;
    }

    pdf.addImage(
      imageData,
      'JPEG',
      x,
      y,
      width,
      height,
      undefined,
      'FAST',
    );

    pdf.save(this.buildFilename(courseTitle, courseId));
  }

  buildFilename(courseTitle: string, courseId: string): string {
    const safeCourseTitle = courseTitle
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[. ]+$/g, '')
      .slice(0, 80)
      .trim();

    const fallback = courseId.trim() || 'Certificate';

    return `Forqan-Certificate-${safeCourseTitle || fallback}.pdf`;
  }

  private async waitForAssets(element: HTMLElement): Promise<void> {
    await document.fonts?.ready;

    const images = Array.from(
      element.querySelectorAll('img'),
    );

    await Promise.all(
      images.map((image) => this.waitForImage(image)),
    );
  }

  private waitForImage(
    image: HTMLImageElement,
  ): Promise<void> {
    if (image.complete) {
      if (!image.naturalWidth) {
        return Promise.reject(
          new Error('Certificate image failed to load.'),
        );
      }

      return image.decode
        ? image.decode()
        : Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      image.addEventListener(
        'load',
        () => resolve(),
        { once: true },
      );

      image.addEventListener(
        'error',
        () =>
          reject(
            new Error(
              'Certificate image failed to load.',
            ),
          ),
        { once: true },
      );
    });
  }
}