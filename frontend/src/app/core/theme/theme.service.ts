import { Injectable } from '@angular/core';

type ThemeMode = 'light' | 'dark' | 'auto';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'theme-mode';
  mode: ThemeMode = 'auto';

  /** Durée du fondu */
  fadeDurationMs = 350;

  private fadeTimeoutId: number | null = null;

  constructor() {
    const saved = localStorage.getItem(this.storageKey) as ThemeMode | null;
    this.mode = saved ?? 'auto';
    this.apply(false); // au démarrage : pas obligatoire de faire un fade
  }

  toggle() {
    // auto -> light -> dark -> auto
    if (this.mode === 'auto') this.setMode('light');
    else if (this.mode === 'light') this.setMode('dark');
    else this.setMode('auto');
  }

  setMode(mode: ThemeMode) {
    this.mode = mode;
    localStorage.setItem(this.storageKey, mode);
    this.apply(true); // fade à chaque changement via le toggle
  }

  apply(withFade: boolean = false) {
    const root = document.documentElement;

    const shouldBeDark =
      this.mode === 'dark' ||
      (this.mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (withFade) {
      this.runFade(() => root.classList.toggle('dark', shouldBeDark));
    } else {
      root.classList.toggle('dark', shouldBeDark);
    }
  }

  private runFade(fn: () => void) {
    const root = document.documentElement;

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
}