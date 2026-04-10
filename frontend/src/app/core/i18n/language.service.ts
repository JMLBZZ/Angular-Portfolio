import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'fr' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'lang';

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
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

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, lang);
    }
  }

  private getSavedLang(): Lang {
    if (!isPlatformBrowser(this.platformId)) {
      return 'fr';
    }

    const raw = localStorage.getItem(this.storageKey);
    return raw === 'en' ? 'en' : 'fr';
  }
}