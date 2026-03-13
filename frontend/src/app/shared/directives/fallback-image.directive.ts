import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[appFallbackImage]',
  standalone: true,
})
export class FallbackImageDirective {
  @Input() fallbackSrc = 'assets/projects/project-placeholder.svg';

  private hasAlreadyErrored = false;

  @HostListener('error', ['$event'])
  onError(event: Event): void {
    if (this.hasAlreadyErrored) {
      return;
    }

    const element = event.target as HTMLImageElement;
    this.hasAlreadyErrored = true;
    element.src = this.fallbackSrc;
  }
}