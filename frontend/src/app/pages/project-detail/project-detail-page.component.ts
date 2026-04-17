import {
  CommonModule,
  DOCUMENT,
} from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ProjectsApiService } from '../../core/api/projects-api.service';
import { AdminProjectsApiService } from '../../core/api/admin-projects-api.service';
import { SeoService } from '../../core/seo/seo.service';
import { LanguageService } from '../../core/i18n/language.service';
import { ProjectPdfService } from '../../core/services/project-pdf.service';
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
export class ProjectDetailPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('pdfExportContent') pdfExportContent?: ElementRef<HTMLElement>;

  project: Project | null = null;
  isLoading = true;
  hasError = false;

  isAdminPreview = false;
  returnProjectId: string | null = null;
  shouldAutoGeneratePdf = false;
  isGeneratingPdf = false;

  private viewReady = false;
  private pendingAutoGeneratePdf = false;
  private readonly subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsApi: ProjectsApiService,
    private adminProjectsApi: AdminProjectsApiService,
    private seoService: SeoService,
    private lang: LanguageService,
    private translate: TranslateService,
    private projectPdfService: ProjectPdfService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.isAdminPreview = this.route.snapshot.queryParamMap.get('source') === 'admin';
    this.returnProjectId = this.route.snapshot.queryParamMap.get('projectId');
    this.shouldAutoGeneratePdf = this.route.snapshot.queryParamMap.get('autoPdf') === '1';

    if (!slug) {
      this.project = null;
      this.hasError = true;
      this.isLoading = false;
      this.setErrorSeo();
      return;
    }

    if (this.isAdminPreview) {
      const adminProjectId = this.returnProjectId;

      if (!adminProjectId) {
        this.project = null;
        this.hasError = true;
        this.isLoading = false;
        this.setErrorSeo();
        return;
      }

      this.adminProjectsApi.getById(adminProjectId).subscribe({
        next: (project) => {
          this.project = project;
          this.isLoading = false;
          this.hasError = false;
          this.updateSeo(project);

          if (this.shouldAutoGeneratePdf) {
            this.pendingAutoGeneratePdf = true;
            this.tryAutoGeneratePdf();
          }

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

      return;
    }

    this.projectsApi.getPublishedProjectBySlug(slug).subscribe({
      next: (project) => {
        this.project = project;
        this.isLoading = false;
        this.hasError = false;
        this.updateSeo(project);

        if (this.shouldAutoGeneratePdf) {
          this.pendingAutoGeneratePdf = true;
          this.tryAutoGeneratePdf();
        }

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

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.tryAutoGeneratePdf();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

    const origin = this.document.location?.origin || 'http://localhost:4200';
    return `${origin}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
  }

  goBackToAdminList(): void {
    const fragment = this.returnProjectId ? `project-${this.returnProjectId}` : undefined;

    this.router.navigate(['/admin/dashboard'], {
      fragment,
    });
  }

  async generatePdf(): Promise<void> {
    if (!this.project || !this.pdfExportContent?.nativeElement || this.isGeneratingPdf) {
      return;
    }

    this.isGeneratingPdf = true;

    try {
      await this.projectPdfService.generateProjectPdf({
        element: this.pdfExportContent.nativeElement,
        title: this.project.title,
        author: 'Jamel BOUAZZA',
        filename: this.project.title,
      });
    } finally {
      this.isGeneratingPdf = false;
    }
  }

  private tryAutoGeneratePdf(): void {
    if (!this.pendingAutoGeneratePdf || !this.viewReady || !this.project) {
      return;
    }

    setTimeout(() => {
      this.generatePdf();
      this.pendingAutoGeneratePdf = false;
    }, 150);
  }

  private updateSeo(project: Project): void {
    const description =
      this.loc(project.longDescription || project.description) ||
      project.title;

    const origin = this.document.location?.origin || 'http://localhost:4200';

    this.seoService.updateSeo({
      title: `${project.title} — ${this.translate.instant('projects.seo.pageTitleSuffix')}`,
      description,
      image: this.heroImage,
      url: `${origin}/projects/${project.slug}`,
      type: 'article',
      robots: this.isAdminPreview ? 'noindex, nofollow' : 'index, follow',
      lang: this.lang.current,
    });
  }

  private setErrorSeo(): void {
    const origin = this.document.location?.origin || 'http://localhost:4200';
    const currentUrl = this.document.location?.href || origin;

    this.seoService.updateSeo({
      title: this.translate.instant('projects.seo.notFoundTitle'),
      description: this.translate.instant('projects.seo.notFoundDescription'),
      image: `${origin}/assets/projects/project-placeholder.svg`,
      url: currentUrl,
      type: 'website',
      robots: this.isAdminPreview ? 'noindex, nofollow' : 'noindex, follow',
      lang: this.lang.current,
    });
  }
}