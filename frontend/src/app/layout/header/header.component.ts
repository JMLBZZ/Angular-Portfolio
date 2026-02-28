import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UpperCasePipe } from '@angular/common';
import { ThemeService } from '../../core/theme/theme.service';
import { LanguageService } from '../../core/i18n/language.service';

type SectionId = 'home' | 'projects' | 'about' | 'contact';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule, UpperCasePipe],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  activeSection: SectionId = 'home';

  private readonly offset = 90;

  constructor(public theme: ThemeService, public lang: LanguageService) {}

  ngOnInit(): void {
    setTimeout(() => this.updateActiveSection(), 0);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateActiveSection();
  }

  private updateActiveSection(): void {
    const ids: SectionId[] = ['home', 'projects', 'about', 'contact'];

    // On prend la dernière section dont le top est passé au-dessus de l’offset
    let current: SectionId = 'home';

    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      if (rect.top <= this.offset) {
        current = id;
      }
    }

    // Cas spécial : si on est tout en bas, on force Contact
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
    if (nearBottom) current = 'contact';

    this.activeSection = current;
  }

  scrollTo(id: SectionId) {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - (this.offset - 10);
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  isActive(id: SectionId): boolean {
    return this.activeSection === id;
  }

  goToAdminLogin() {
    window.location.href = '/admin/login';
  }
}