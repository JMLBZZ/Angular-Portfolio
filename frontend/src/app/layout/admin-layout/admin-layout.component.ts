import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private seoService: SeoService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.updateSeo(this.router.url);

    this.subscription.add(
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event) => {
          this.updateSeo(event.urlAfterRedirects);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get email(): string {
    return this.authService.getUserEmail() ?? 'admin';
  }

  logout(): void {
    this.authService.logout();
    this.toastService.info('Vous avez été déconnecté.');
    this.router.navigate(['/admin/login']);
  }

  private updateSeo(currentUrl: string): void {
    const origin = this.document.location?.origin ?? 'http://localhost:4200';

    this.seoService.updateSeo({
      title: `${this.getAdminPageTitle(currentUrl)} — JMLBZZ`,
      description: 'Interface d’administration du portfolio.',
      url: `${origin}${currentUrl}`,
      type: 'website',
      robots: 'noindex, nofollow',
      lang: 'fr',
    });
  }

  private getAdminPageTitle(url: string): string {
    if (url.includes('/admin/dashboard')) {
      return 'Dashboard administration';
    }

    if (url.includes('/admin/projects/new')) {
      return 'Nouveau projet';
    }

    if (url.includes('/admin/projects/') && url.includes('/edit')) {
      return 'Modifier un projet';
    }

    if (url.includes('/admin/contact')) {
      return 'Administration contact';
    }

    if (url.includes('/admin/hero')) {
      return 'Administration hero';
    }

    if (url.includes('/admin/about')) {
      return 'Administration about';
    }

    if (url.includes('/admin/resume')) {
      return 'Administration CV';
    }

    return 'Administration';
  }
}