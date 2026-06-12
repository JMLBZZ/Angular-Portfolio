import { DOCUMENT, isPlatformBrowser, UpperCasePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, EMPTY, Subscription, take } from 'rxjs';

import { LanguageService } from '../../core/i18n/language.service';
import { PublicAnalyticsApiService } from '../../core/api/public-analytics-api.service';
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
export class PublicHomePageComponent implements OnInit, OnDestroy {
  title = 'Portfolio JMLBZZ';

  selectedProject: Project | null = null;
  isProjectModalOpen = false;

  private readonly subscription = new Subscription();

  constructor(
    public lang: LanguageService,
    private publicAnalyticsApi: PublicAnalyticsApiService,
    private seoService: SeoService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this.registerVisit();
    this.updateSeo();

    this.subscription.add(
      this.translate.onLangChange.subscribe(() => {
        this.updateSeo();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openProject(project: Project): void {
    this.selectedProject = project;
    this.isProjectModalOpen = true;
  }

  closeProjectModal(): void {
    this.isProjectModalOpen = false;
    setTimeout(() => (this.selectedProject = null), 200);
  }

  private registerVisit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.publicAnalyticsApi
      .registerVisit()
      .pipe(
        take(1),
        catchError(() => EMPTY)
      )
      .subscribe();
  }

  private updateSeo(): void {
    const baseUrl = this.document.location?.origin || 'http://localhost:4200';

    this.seoService.updateSeo({
      title: this.translate.instant('seo.homeTitle'),
      description: this.translate.instant('seo.homeDescription'),
      image: `${baseUrl}/assets/projects/project-placeholder.svg`,
      url: baseUrl,
      type: 'website',
      robots: 'index, follow',
      lang: this.lang.current,
    });
  }
}