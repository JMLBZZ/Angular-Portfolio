import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { resolveMediaUrl } from '../../../core/api/media-url.utils';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex shrink-0 items-center justify-center overflow-hidden"
      [ngClass]="containerClass"
      role="img"
      [attr.aria-label]="ariaLabel"
    >
      <img
        *ngIf="shouldShowImage"
        [src]="resolvedLogoImageUrl ?? ''"
        alt=""
        class="h-full w-full object-contain"
        loading="lazy"
        decoding="async"
        (error)="onImageError()"
      />

      <span
        *ngIf="shouldShowSvg"
        class="flex h-full w-full items-center justify-center [&_svg]:h-full [&_svg]:w-full"
        [innerHTML]="trustedLogoSvgCode"
        aria-hidden="true"
      ></span>

      <span
        *ngIf="shouldShowText"
        class="font-black tracking-tight"
        aria-hidden="true"
      >
        {{ fallbackText }}
      </span>
    </span>
  `,
})
export class LogoComponent implements OnChanges {
  @Input() logoImageUrl = '';
  @Input() logoSvgCode = '';
  @Input() fallbackText = 'JML';
  @Input() ariaLabel = 'Logo du portfolio';
  @Input() containerClass = 'h-10 w-10 text-lg text-primary';

  imageFailed = false;
  trustedLogoSvgCode: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['logoImageUrl']) {
      this.imageFailed = false;
    }

    if (changes['logoSvgCode']) {
      this.trustedLogoSvgCode = this.sanitizer.bypassSecurityTrustHtml(
        this.normalizedLogoSvgCode
      );
    }
  }

  get normalizedLogoSvgCode(): string {
    return String(this.logoSvgCode ?? '').trim();
  }

  get resolvedLogoImageUrl(): string | null {
    return resolveMediaUrl(this.logoImageUrl) ?? null;
  }

  get shouldShowImage(): boolean {
    return !!this.resolvedLogoImageUrl && !this.imageFailed;
  }

  get shouldShowSvg(): boolean {
    return (!this.resolvedLogoImageUrl || this.imageFailed) && !!this.normalizedLogoSvgCode;
  }

  get shouldShowText(): boolean {
    return !this.shouldShowImage && !this.shouldShowSvg;
  }

  onImageError(): void {
    this.imageFailed = true;
  }
}