import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UpperCasePipe } from '@angular/common';

import { LanguageService } from '../../core/i18n/language.service';
import { SeoService } from '../../core/seo/seo.service';

import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';

import { HeroComponent } from '../../sections/hero/hero.component';
import { ProjectsSectionComponent } from '../../sections/projects/projects-section.component';
import { ProjectDetailModalComponent } from '../../sections/projects/project-detail-modal/project-detail-modal.component';
import { AboutSectionComponent } from '../../sections/about/about-section.component';
import { ContactSectionComponent } from '../../sections/contact/contact-section.component';

import { Project } from '../../shared/models/project.model';

@Component({
  selector: 'app-public-home-page',
  standalone: true,
  imports: [
    TranslateModule,
    UpperCasePipe,
    HeaderComponent,
    FooterComponent,
    HeroComponent,
    ProjectsSectionComponent,
    ProjectDetailModalComponent,
    AboutSectionComponent,
    ContactSectionComponent,
  ],
  templateUrl: './public-home-page.component.html',
})
export class PublicHomePageComponent implements OnInit {
  title = 'Portfolio JMLBZZ';

  selectedProject: Project | null = null;
  isProjectModalOpen = false;

  constructor(
    public lang: LanguageService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    // Configuration SEO du portfolio
    this.seoService.updateSeo({
      title: 'JMLBZZ — Développeur Full-Stack',
      description:
        'Portfolio de JMLBZZ, développeur full-stack spécialisé en Angular, Spring Boot et PostgreSQL. Découvrez mes projets, mes compétences et contactez-moi.',
      image: 'https://domainearemplacer.com/og-image.jpg',//<!-- A REMPLACER LORSQUE J'AURAIS MON NOM DE DOMAINE-->
      url: 'https://domainearemplacer.com',//<!-- A REMPLACER LORSQUE J'AURAIS MON NOM DE DOMAINE-->
    });
  }

  openProject(project: Project): void {
    this.selectedProject = project;
    this.isProjectModalOpen = true;
  }

  closeProjectModal(): void {
    this.isProjectModalOpen = false;
    setTimeout(() => (this.selectedProject = null), 200);
  }
}