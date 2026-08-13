import {
  Directive,
  ElementRef,
  input,
  afterNextRender,
  inject,
  Renderer2,
  DestroyRef,
} from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective {
  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private destroyRef = inject(DestroyRef);

  delay = input<number | string>(0, { alias: 'appScrollReveal' });

  constructor() {
    afterNextRender(() => {
      const el = this.el.nativeElement;

      this.renderer.addClass(el, 'reveal-init');
      this.renderer.setStyle(el, 'transition-delay', `${this.delay()}ms`);

      const cleanup = () => {
        this.renderer.removeClass(el, 'reveal-init');
        this.renderer.removeStyle(el, 'transition-delay');
        this.renderer.setStyle(el, 'will-change', 'auto');
        el.removeEventListener('transitionend', cleanup);
      };
      el.addEventListener('transitionend', cleanup);

      const reveal = () => {
        this.renderer.addClass(el, 'reveal-visible');
      };

      if (!('IntersectionObserver' in window)) {
        requestAnimationFrame(reveal);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal();
              observer.unobserve(el);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -40px 0px',
        }
      );

      observer.observe(el);

      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}