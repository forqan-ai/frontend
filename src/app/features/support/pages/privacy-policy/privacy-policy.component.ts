import { Component, signal, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

interface PrivacySectionLink {
  id: string;
  number: string;
  label: string;
}

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css',
})
export class PrivacyPolicyComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  readonly sections: ReadonlyArray<PrivacySectionLink> = [
    { id: 'introduction', number: '01', label: 'مقدمة' },
    { id: 'data-collected', number: '02', label: 'البيانات التي نجمعها' },
    { id: 'data-use', number: '03', label: 'كيف نستخدم بياناتك' },
    { id: 'data-sharing', number: '04', label: 'مشاركة البيانات' },
    { id: 'cookies', number: '05', label: 'ملفات تعريف الارتباط' },
    { id: 'data-security', number: '06', label: 'حفظ البيانات وحمايتها' },
    { id: 'rights', number: '07', label: 'حقوقك' },
    { id: 'children', number: '08', label: 'خصوصية صغار السن' },
    { id: 'updates', number: '09', label: 'تحديثات سياسة الخصوصية' },
    { id: 'contact', number: '10', label: 'تواصل معنا' },
  ];

  readonly activeSection = signal('introduction');

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && typeof IntersectionObserver !== 'undefined') {
      const options: IntersectionObserverInit = {
        root: null,
        rootMargin: '-96px 0px -65% 0px',
        threshold: [0, 0.1, 0.25, 0.5],
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        });
      }, options);

      this.sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) {
          this.observer?.observe(el);
        }
      });
    }
  }

  setActiveSection(sectionId: string): void {
    this.activeSection.set(sectionId);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
