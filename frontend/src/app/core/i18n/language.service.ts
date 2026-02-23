import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'fr' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'lang';

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['fr', 'en']);
    const saved = this.getSavedLang();
    this.setLang(saved);
  }

  get current(): Lang {
    return (this.translate.currentLang as Lang) || 'fr';
  }

  toggle() {
    this.setLang(this.current === 'fr' ? 'en' : 'fr');
  }

  setLang(lang: Lang) {
    this.translate.use(lang);
    localStorage.setItem(this.storageKey, lang);
  }

  private getSavedLang(): Lang {
    const raw = localStorage.getItem(this.storageKey);
    return raw === 'en' ? 'en' : 'fr';
  }
}