import { Component, signal, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

interface TermsSectionLink {
  id: string;
  number: string;
  label: string;
}

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.css',
})
export class TermsAndConditionsComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  readonly sections: ReadonlyArray<TermsSectionLink> = [
    { id: 'introduction', number: '01', label: 'مقدمة وقبول الشروط' },
    { id: 'eligibility', number: '02', label: 'أهلية الاستخدام والحسابات' },
    { id: 'services', number: '03', label: 'خدمات منصة الفرقان' },
    { id: 'courses-certificates', number: '04', label: 'الدورات والشهادات' },
    { id: 'payments-points', number: '05', label: 'المدفوعات والنقاط' },
    { id: 'sessions-bookings', number: '06', label: 'الجلسات والحجوزات' },
    { id: 'learning-circles', number: '07', label: 'حلقات العلم والتواصل' },
    { id: 'teachers', number: '08', label: 'شروط المعلمين' },
    { id: 'intellectual-property', number: '09', label: 'الملكية الفكرية' },
    { id: 'prohibited-use', number: '10', label: 'الاستخدامات المحظورة' },
    { id: 'account-suspension', number: '11', label: 'تعليق الحساب وإنهاؤه' },
    { id: 'availability-liability', number: '12', label: 'توفر الخدمة والمسؤولية' },
    { id: 'updates-law', number: '13', label: 'تحديث الشروط والقانون' },
    { id: 'contact', number: '14', label: 'تواصل معنا' },
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
