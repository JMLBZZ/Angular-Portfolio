import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { LegalContentApiService } from '../../core/api/legal-content-api.service';
import { LanguageService } from '../../core/i18n/language.service';
import { SeoService } from '../../core/seo/seo.service';
import { LegalContent } from '../../shared/models/legal.model';

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './legal-page.component.html',
})
export class LegalPageComponent implements OnInit, OnDestroy {
  legalContent: LegalContent | null = null;
  isLoading = false;
  errorMessage = '';

  private readonly subscriptions = new Subscription();

  constructor(
    private legalContentApiService: LegalContentApiService,
    public lang: LanguageService,
    private seoService: SeoService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.updateSeo();
    this.loadLegalContent();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get title(): string {
    if (!this.legalContent) {
      return this.lang.current === 'fr'
        ? 'Mentions légales & Politique de confidentialité'
        : 'Legal notice & Privacy policy';
    }

    return this.lang.current === 'fr'
      ? this.legalContent.title.fr
      : this.legalContent.title.en;
  }

  get content(): string {
    if (!this.legalContent) {
      return '';
    }

    return this.lang.current === 'fr'
      ? this.legalContent.content.fr
      : this.legalContent.content.en;
  }

  private loadLegalContent(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.subscriptions.add(
      this.legalContentApiService.get().subscribe({
        next: (legalContent) => {
          this.legalContent = legalContent;
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage =
            this.lang.current === 'fr'
              ? 'Le contenu légal est momentanément indisponible.'
              : 'Legal content is temporarily unavailable.';
          this.isLoading = false;
        },
      })
    );
  }

  private updateSeo(): void {
    const baseUrl = this.document.location?.origin || 'http://localhost:4200';

    this.seoService.updateSeo({
      title:
        this.lang.current === 'fr'
          ? 'Mentions légales & Politique de confidentialité | JMLBZZ'
          : 'Legal notice & Privacy policy | JMLBZZ',
      description:
        this.lang.current === 'fr'
          ? 'Consultez les mentions légales et la politique de confidentialité du portfolio JMLBZZ.'
          : 'Read the legal notice and privacy policy of the JMLBZZ portfolio.',
      url: `${baseUrl}/legal`,
      type: 'website',
      robots: 'index, follow',
      lang: this.lang.current,
    });
  }
}