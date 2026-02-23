import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UpperCasePipe } from '@angular/common';
import { ThemeService } from '../../core/theme/theme.service';
import { LanguageService } from '../../core/i18n/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule, UpperCasePipe],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  constructor(public theme: ThemeService, public lang: LanguageService) {}

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  goToAdminLogin() {
    window.location.href = '/admin/login';
  }
}