import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ThemeService } from './core/theme/theme.service';
import { LanguageService } from './core/i18n/language.service';
import { SeoService } from './core/seo/seo.service';

import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

import { HeroComponent } from './sections/hero/hero.component';
import { ProjectsSectionComponent } from './sections/projects/projects-section.component';
import { Project } from './sections/projects/projects.data';
import { ProjectDetailModalComponent } from './sections/projects/project-detail-modal/project-detail-modal.component';
import { AboutSectionComponent } from './sections/about/about-section.component';
import { ContactSectionComponent } from './sections/contact/contact-section.component';

import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { ToastService } from './shared/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TranslateModule,
    UpperCasePipe,
    HeaderComponent,
    FooterComponent,
    HeroComponent,
    ProjectsSectionComponent,
    ProjectDetailModalComponent,
    AboutSectionComponent,
    ContactSectionComponent,
    ToastContainerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  title = 'Portfolio JMLBZZ';

  selectedProject: Project | null = null;
  isProjectModalOpen = false;

  constructor(
    public theme: ThemeService,
    public lang: LanguageService,
    private toastService: ToastService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.theme.apply();

    // Configuration SEO du portfolio
    this.seoService.updateSeo({
      title: 'JMLBZZ — Développeur Full-Stack',
      description:
        'Portfolio de JMLBZZ, développeur full-stack spécialisé en Angular, Spring Boot et PostgreSQL. Découvrez mes projets, mes compétences et contactez-moi.',
      image: 'https://domainearemplacer.com/og-image.jpg',//<!-- A REMPLACER LORSQUE J'AURAIS MON NOM DE DOMAINE-->
      url: 'https://domainearemplacer.com',//<!-- A REMPLACER LORSQUE J'AURAIS MON NOM DE DOMAINE-->
    });
  }

  openProject(project: Project) {
    this.selectedProject = project;
    this.isProjectModalOpen = true;
  }

  closeProjectModal() {
    this.isProjectModalOpen = false;
    setTimeout(() => (this.selectedProject = null), 200);
  }
}