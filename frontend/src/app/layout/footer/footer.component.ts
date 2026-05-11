import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IconButtonComponent } from '../../shared/components/icon-button/icon-button.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, IconButtonComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  year = new Date().getFullYear();

  githubUrl = 'https://github.com/';
  linkedinUrl = 'https://www.linkedin.com/';
  email = 'contact@mail.com';

  constructor(private router: Router) {}

  scrollTo(id: 'home' | 'projects' | 'about' | 'contact') {
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollToElement(id), 100);
      });
      return;
    }

    this.scrollToElement(id);
  }

  private scrollToElement(id: 'home' | 'projects' | 'about' | 'contact') {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(id);
    if (!el) return;

    const offset = 90;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}