import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CertificatePdfService {
  async download(
    element: HTMLElement,
    courseTitle: string,
    courseId: string,
  ): Promise<void> {
    await this.waitForAssets(element);
    const { default: html2pdf } = await import('html2pdf.js');

    await html2pdf()
      .set({
        margin: 0,
        filename: this.buildFilename(courseTitle, courseId),
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          backgroundColor: '#ffffff',
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'landscape',
        },
      })
      .from(element)
      .save();
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
    const images = Array.from(element.querySelectorAll('img'));
    await Promise.all(images.map((image) => this.waitForImage(image)));
  }

  private waitForImage(image: HTMLImageElement): Promise<void> {
    if (image.complete) {
      if (!image.naturalWidth) {
        return Promise.reject(new Error('Certificate image failed to load.'));
      }

      return image.decode ? image.decode() : Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      image.addEventListener('load', () => resolve(), { once: true });
      image.addEventListener(
        'error',
        () => reject(new Error('Certificate image failed to load.')),
        { once: true },
      );
    });
  }
}
