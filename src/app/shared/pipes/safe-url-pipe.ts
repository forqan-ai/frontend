import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true
})
export class SafeUrlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeResourceUrl {
    if (!value) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
}