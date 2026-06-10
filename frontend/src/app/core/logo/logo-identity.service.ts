import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, combineLatest, map, of, shareReplay, tap } from 'rxjs';

import { AboutContentApiService } from '../api/about-content-api.service';
import { AppearanceApiService } from '../api/appearance-api.service';
import { resolveMediaUrl } from '../api/media-url.utils';
import { DEFAULT_ACCENT_COLOR } from '../../shared/models/appearance.model';

export interface LogoAppearance {
  accentColor: string;
  logoImageUrl: string;
  logoSvgCode: string;
  showHeroLogo: boolean;
}

export interface LogoIdentity extends LogoAppearance {
  displayName: string;
}

@Injectable({ providedIn: 'root' })
export class LogoIdentityService {
  readonly defaultDisplayName = 'Jamel Bouazza';

  readonly appearance$ = this.appearanceApi.get().pipe(
    map((settings): LogoAppearance => ({
      accentColor: this.normalizeAccentColor(settings.accentColor),
      logoImageUrl: this.normalizePlainText(settings.logoImageUrl ?? ''),
      logoSvgCode: this.normalizePlainText(settings.logoSvgCode ?? ''),
      showHeroLogo: settings.showHeroLogo ?? true,
    })),
    catchError(() =>
      of({
        accentColor: DEFAULT_ACCENT_COLOR,
        logoImageUrl: '',
        logoSvgCode: '',
        showHeroLogo: true,
      })
    ),
    tap((appearance) => {
      this.applyFavicon(appearance);
    }),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  readonly displayName$ = this.aboutContentApi.get().pipe(
    map((about) => this.normalizeDisplayName(about.profileName)),
    catchError(() => of(this.defaultDisplayName)),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  readonly identity$ = combineLatest([
    this.appearance$,
    this.displayName$,
  ]).pipe(
    map(([appearance, displayName]): LogoIdentity => ({
      ...appearance,
      displayName,
    })),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  constructor(
    private appearanceApi: AppearanceApiService,
    private aboutContentApi: AboutContentApiService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  private applyFavicon(appearance: LogoAppearance): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const logoImageUrl = resolveMediaUrl(appearance.logoImageUrl) ?? '';
    const logoSvgCode = appearance.logoSvgCode.trim();

    if (logoImageUrl && logoSvgCode) {
      const image = new Image();

      image.onload = () => {
        this.setFavicon(logoImageUrl, this.getFaviconType(logoImageUrl));
      };

      image.onerror = () => {
        this.setFavicon(this.buildSvgDataUri(logoSvgCode), 'image/svg+xml');
      };

      image.src = logoImageUrl;
      return;
    }

    if (logoImageUrl) {
      this.setFavicon(logoImageUrl, this.getFaviconType(logoImageUrl));
      return;
    }

    if (logoSvgCode) {
      this.setFavicon(this.buildSvgDataUri(logoSvgCode), 'image/svg+xml');
    }
  }

  private setFavicon(href: string, type: string): void {
    let favicon = this.document.querySelector<HTMLLinkElement>('link[rel="icon"]');

    if (!favicon) {
      favicon = this.document.createElement('link');
      favicon.rel = 'icon';
      this.document.head.appendChild(favicon);
    }

    favicon.href = href;
    favicon.type = type;
  }

  private buildSvgDataUri(svgCode: string): string {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgCode)}`;
  }

  private getFaviconType(url: string): string {
    const normalizedUrl = url.toLowerCase().split('?')[0];

    if (normalizedUrl.endsWith('.svg')) {
      return 'image/svg+xml';
    }

    if (normalizedUrl.endsWith('.png')) {
      return 'image/png';
    }

    if (normalizedUrl.endsWith('.jpg') || normalizedUrl.endsWith('.jpeg')) {
      return 'image/jpeg';
    }

    if (normalizedUrl.endsWith('.gif')) {
      return 'image/gif';
    }

    return 'image/x-icon';
  }

  private normalizeAccentColor(color: string): string {
    const normalizedColor = String(color ?? '').trim().toLowerCase();

    if (!/^#[0-9a-f]{6}$/.test(normalizedColor)) {
      return DEFAULT_ACCENT_COLOR;
    }

    return normalizedColor;
  }

  private normalizePlainText(value: string): string {
    return String(value ?? '').trim();
  }

  private normalizeDisplayName(value: string): string {
    const displayName = String(value ?? '').trim();

    return displayName || this.defaultDisplayName;
  }
}
