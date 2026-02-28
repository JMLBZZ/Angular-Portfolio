import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true,
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, private r: Renderer2) {}

  ngAfterViewInit(): void {
    const baseClasses = [
      'opacity-0',
      'translate-y-2',
      'transition-all',
      'duration-500',
      'ease-out',
      'will-change-[opacity,transform]',
    ];
    baseClasses.forEach((c) => this.r.addClass(this.el.nativeElement, c));

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.r.removeClass(this.el.nativeElement, 'opacity-0');
          this.r.removeClass(this.el.nativeElement, 'translate-y-2');
          this.r.addClass(this.el.nativeElement, 'opacity-100');
          this.r.addClass(this.el.nativeElement, 'translate-y-0');
        }
      },
      { threshold: 0.15 }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}