import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import {
  ExternalLinkIcon,
  FileTextIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MailIcon,
  MenuIcon,
  MessageSquareTextIcon,
  PaletteIcon,
  ScaleIcon,
  SparklesIcon,
  UserRoundIcon,
  XIcon,
  LucideAngularModule,
} from 'lucide-angular';

import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { SeoService } from '../../core/seo/seo.service';

type AdminNavItem = {
  label: string;
  path: string;
  icon: any;
  exact?: boolean;
};

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
  ],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();

  readonly MenuIcon = MenuIcon;
  readonly XIcon = XIcon;
  readonly ExternalLinkIcon = ExternalLinkIcon;
  readonly LogOutIcon = LogOutIcon;

  isMobileMenuOpen = false;

  readonly navItems: AdminNavItem[] = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboardIcon,
      exact: true,
    },
    {
      label: 'Projets',
      path: '/admin/projects',
      icon: FolderKanbanIcon,
    },
    {
      label: 'Hero',
      path: '/admin/hero',
      icon: SparklesIcon,
    },
    {
      label: 'À propos',
      path: '/admin/about',
      icon: UserRoundIcon,
    },
    {
      label: 'CV',
      path: '/admin/resume',
      icon: FileTextIcon,
    },
    {
      label: 'Contact',
      path: '/admin/contact',
      icon: MailIcon,
    },
    {
      label: 'Legal',
      path: '/admin/legal',
      icon: ScaleIcon,
    },
    {
      label: 'Messages',
      path: '/admin/messages',
      icon: MessageSquareTextIcon,
    },
    {
      label: 'Apparence',
      path: '/admin/appearance',
      icon: PaletteIcon,
    },
  ];

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
          this.isMobileMenuOpen = false;
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

  get currentPageTitle(): string {
    return this.getAdminPageTitle(this.router.url);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
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

    if (url.includes('/admin/projects')) {
      return 'Gestion des projets';
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

    if (url.includes('/admin/legal')) {
      return 'Administration mentions légales';
    }

    if (url.includes('/admin/messages')) {
      return 'Messages reçus';
    }

    if (url.includes('/admin/appearance')) {
      return 'Apparence du portfolio';
    }

    return 'Administration';
  }
}