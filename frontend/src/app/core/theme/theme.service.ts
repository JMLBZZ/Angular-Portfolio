import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { DEFAULT_ACCENT_COLOR } from '../../shared/models/appearance.model';

type ThemeMode = 'light' | 'dark' | 'auto';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'theme-mode';
  mode: ThemeMode = 'auto';

  /** Durée du fondu */
  fadeDurationMs = 350;

  private fadeTimeoutId: number | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.storageKey) as ThemeMode | null;
      this.mode = saved ?? 'auto';
    }

    this.apply(false); // au démarrage : pas obligatoire de faire un fade
    this.applyAccentColor(DEFAULT_ACCENT_COLOR);
  }

  toggle() {
    // auto -> light -> dark -> auto
    if (this.mode === 'auto') this.setMode('light');
    else if (this.mode === 'light') this.setMode('dark');
    else this.setMode('auto');
  }

  setMode(mode: ThemeMode) {
    this.mode = mode;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, mode);
    }

    this.apply(true); // fade à chaque changement via le toggle
  }

  apply(withFade: boolean = false) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const root = this.document.documentElement;

    const shouldBeDark =
      this.mode === 'dark' ||
      (this.mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (withFade) {
      this.runFade(() => root.classList.toggle('dark', shouldBeDark));
    } else {
      root.classList.toggle('dark', shouldBeDark);
    }
  }

  applyAccentColor(accentColor: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const normalizedAccentColor = this.normalizeHexColor(accentColor);
    const rgb = this.hexToRgb(normalizedAccentColor);

    if (!rgb) {
      return;
    }

    const root = this.document.documentElement;

    root.style.setProperty('--primary', `${rgb.r} ${rgb.g} ${rgb.b}`);
    root.style.setProperty('--primary-foreground', this.getReadableForeground(rgb));
  }

  resetAccentColor(): void {
    this.applyAccentColor(DEFAULT_ACCENT_COLOR);
  }

  private runFade(fn: () => void) {
    if (!isPlatformBrowser(this.platformId)) {
      fn();
      return;
    }

    const root = this.document.documentElement;

    // si on reclique vite, on "redémarre" la transition
    if (this.fadeTimeoutId !== null) {
      window.clearTimeout(this.fadeTimeoutId);
      this.fadeTimeoutId = null;
    }

    // expose la durée au CSS
    root.style.setProperty('--theme-fade-ms', `${this.fadeDurationMs}ms`);

    // force un re-trigger
    root.classList.remove('theme-fade');
    void root.offsetHeight;
    root.classList.add('theme-fade');

    requestAnimationFrame(() => {
      fn();

      this.fadeTimeoutId = window.setTimeout(() => {
        root.classList.remove('theme-fade');
        this.fadeTimeoutId = null;
      }, this.fadeDurationMs);
    });
  }

  private normalizeHexColor(color: string): string {
    const normalizedColor = String(color ?? '').trim().toLowerCase();

    if (!normalizedColor.match(/^#[0-9a-f]{6}$/)) {
      return DEFAULT_ACCENT_COLOR;
    }

    return normalizedColor;
  }

  private hexToRgb(color: string): { r: number; g: number; b: number } | null {
    const match = color.match(/^#([0-9a-f]{6})$/i);

    if (!match) {
      return null;
    }

    const value = match[1];

    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16),
    };
  }

  private getReadableForeground(rgb: { r: number; g: number; b: number }): string {
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

    return brightness > 140 ? '17 24 39' : '255 255 255';
  }
}