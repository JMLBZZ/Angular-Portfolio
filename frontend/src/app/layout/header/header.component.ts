import { isPlatformBrowser, UpperCasePipe } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ThemeService } from '../../core/theme/theme.service';
import { LanguageService } from '../../core/i18n/language.service';
import { IconButtonComponent } from '../../shared/components/icon-button/icon-button.component';

type SectionId = 'home' | 'projects' | 'about' | 'contact';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule, UpperCasePipe, IconButtonComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  activeSection: SectionId | null = 'home';

  private readonly offset = 90;

  constructor(
    public theme: ThemeService,
    public lang: LanguageService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    setTimeout(() => this.updateActiveSection(), 0);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.updateActiveSection();
  }

  scrollTo(id: SectionId): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.router.url.split('?')[0] !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollToElement(id), 100);
      });
      return;
    }

    this.scrollToElement(id);
  }

  isActive(id: SectionId): boolean {
    return this.activeSection === id;
  }

  goToAdminLogin(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.router.navigate(['/admin/login']);
  }

  getNavAriaCurrent(id: SectionId): 'page' | null {
    return this.isActive(id) ? 'page' : null;
  }

  getSectionAriaLabel(id: SectionId): string {
    switch (id) {
      case 'home':
        return 'Aller à la section accueil';
      case 'projects':
        return 'Aller à la section projets';
      case 'about':
        return 'Aller à la section à propos';
      case 'contact':
        return 'Aller à la section contact';
      default:
        return 'Aller à la section';
    }
  }

  getLanguageButtonLabel(): string {
    return this.lang.current === 'fr'
      ? 'Changer la langue en anglais'
      : 'Switch language to French';
  }

  getThemeButtonLabel(): string {
    return 'Changer le thème (clair ou sombre)';
  }

  private updateActiveSection(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.router.url.split('?')[0] !== '/') {
      this.activeSection = null;
      return;
    }

    const ids: SectionId[] = ['home', 'projects', 'about', 'contact'];
    let current: SectionId = 'home';

    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      if (rect.top <= this.offset) {
        current = id;
      }
    }

    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;

    if (nearBottom) {
      current = 'contact';
    }

    this.activeSection = current;
  }

  private scrollToElement(id: SectionId): void {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(id);
    if (!el) {
      return;
    }

    const y = el.getBoundingClientRect().top + window.scrollY - (this.offset - 10);
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}