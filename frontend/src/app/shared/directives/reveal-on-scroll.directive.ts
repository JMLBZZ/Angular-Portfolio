import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true,
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  @Input() revealClass = 'reveal-visible';
  @Input() threshold = 0.15; // 0 -> 1 (plus petit = révèle plus tôt)

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, private r: Renderer2) {}

  ngOnInit(): void {
    // état initial (caché)
    this.r.addClass(this.el.nativeElement, 'reveal');
    this.r.removeClass(this.el.nativeElement, this.revealClass);

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.r.addClass(this.el.nativeElement, this.revealClass);
            // une fois visible, on n’observe plus (perfs)
            this.observer?.unobserve(this.el.nativeElement);
          }
        }
      },
      { threshold: this.threshold }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}