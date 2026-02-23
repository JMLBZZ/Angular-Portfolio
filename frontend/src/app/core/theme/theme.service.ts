import { Injectable } from '@angular/core';

export type ThemeMode = 'light' | 'dark';
export type ThemePreference = 'auto' | ThemeMode;

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme_preference';

  /** Préférence utilisateur (auto / light / dark) */
  getPreference(): ThemePreference {
    const raw = localStorage.getItem(this.storageKey);
    if (raw === 'light' || raw === 'dark' || raw === 'auto') return raw;
    return 'auto';
  }

  setPreference(pref: ThemePreference) {
    localStorage.setItem(this.storageKey, pref);
    this.apply();
  }

  /** Applique le thème effectif en fonction de la préférence et de l’heure */
  apply() {
    const pref = this.getPreference();
    const effective = pref === 'auto' ? this.computeAutoTheme() : pref;
    this.setHtmlClass(effective);
  }

  /** Mode auto : light à partir de 07h, dark à partir de 20h */
  computeAutoTheme(now = new Date()): ThemeMode {
    const h = now.getHours();
    return (h >= 7 && h < 20) ? 'light' : 'dark';
  }

  /** Toggle simple : si auto -> bascule vers l’inverse du mode auto; sinon toggle light/dark */
  toggle() {
    const pref = this.getPreference();
    if (pref === 'auto') {
      const auto = this.computeAutoTheme();
      this.setPreference(auto === 'light' ? 'dark' : 'light');
      return;
    }
    this.setPreference(pref === 'light' ? 'dark' : 'light');
  }

  setAuto() {
    this.setPreference('auto');
  }

  private setHtmlClass(mode: ThemeMode) {
    const html = document.documentElement;
    if (mode === 'dark') html.classList.add('dark');
    else html.classList.remove('dark');
  }
}