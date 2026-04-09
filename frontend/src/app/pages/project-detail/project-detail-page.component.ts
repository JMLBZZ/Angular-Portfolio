import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ProjectsApiService } from '../../core/api/projects-api.service';
import { SeoService } from '../../core/seo/seo.service';
import { SEO_CONFIG } from '../../core/seo/seo.config';
import { LanguageService } from '../../core/i18n/language.service';
import { Project } from '../../shared/models/project.model';
import { FallbackImageDirective } from '../../shared/directives/fallback-image.directive';
import { ProjectContentComponent } from '../../shared/components/project-content/project-content.component';

@Component({
  selector: 'app-project-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    FallbackImageDirective,
    ProjectContentComponent,
  ],
  templateUrl: './project-detail-page.component.html',
})
export class ProjectDetailPageComponent implements OnInit, OnDestroy {
  project: Project | null = null;
  isLoading = true;
  hasError = false;

  private readonly subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private projectsApi: ProjectsApiService,
    private seoService: SeoService,
    private lang: LanguageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.project = null;
      this.hasError = true;
      this.isLoading = false;
      this.setErrorSeo();
      return;
    }

    this.projectsApi.getPublishedProjectBySlug(slug).subscribe({
      next: (project) => {
        this.project = project;
        this.isLoading = false;
        this.hasError = false;
        this.updateSeo(project);

        this.subscription.add(
          this.translate.onLangChange.subscribe(() => {
            if (this.project) {
              this.updateSeo(this.project);
            }
          })
        );
      },
      error: () => {
        this.project = null;
        this.hasError = true;
        this.isLoading = false;
        this.setErrorSeo();

        this.subscription.add(
          this.translate.onLangChange.subscribe(() => {
            this.setErrorSeo();
          })
        );
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.seoService.removeStructuredData();
  }

  loc(value?: { fr?: string; en?: string } | null): string {
    if (!value) return '';

    const currentLang = this.lang.current;

    return value[currentLang] ?? value.fr ?? value.en ?? '';
  }

  get heroImage(): string {
    const imagePath =
      this.project?.cover ||
      this.project?.image ||
      '/assets/projects/project-placeholder.svg';

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    return `${window.location.origin}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
  }

  private updateSeo(project: Project): void {
    const description =
      this.loc(project.longDescription || project.description) ||
      project.title;

    const pageUrl = `${window.location.origin}/projects/${project.slug}`;

    this.seoService.updateSeo({
      title: `${project.title} — ${this.translate.instant('projects.seo.pageTitleSuffix')}`,
      description,
      image: this.heroImage,
      url: pageUrl,
      type: 'article',
      robots: 'index, follow',
      lang: this.lang.current,
    });

    this.seoService.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description,
      url: pageUrl,
      image: this.heroImage,
      inLanguage: this.lang.current,
      author: {
        '@type': 'Person',
        name: SEO_CONFIG.personName,
      },
      creator: {
        '@type': 'Person',
        name: SEO_CONFIG.personName,
      },
    });
  }

  private setErrorSeo(): void {
    this.seoService.updateSeo({
      title: this.translate.instant('projects.seo.notFoundTitle'),
      description: this.translate.instant('projects.seo.notFoundDescription'),
      image: `${window.location.origin}/assets/projects/project-placeholder.svg`,
      url: window.location.href,
      type: 'website',
      robots: 'noindex, follow',
      lang: this.lang.current,
    });

    this.seoService.removeStructuredData();
  }
}