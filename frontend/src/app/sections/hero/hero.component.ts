import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../shared/components/secondary-button/secondary-button.component';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { HeroContentApiService } from '../../core/api/hero-content-api.service';
import { HeroCardContentApiService } from '../../core/api/hero-card-content-api.service';
import { ResumeContentApiService } from '../../core/api/resume-content-api.service';
import { resolveMediaUrl } from '../../core/api/media-url.utils';
import { LanguageService } from '../../core/i18n/language.service';
import { LogoIdentityService } from '../../core/logo/logo-identity.service';
import { Hero, HeroTechBadge } from '../../shared/models/hero.model';
import { HeroCard } from '../../shared/models/hero-card.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    LogoComponent,
    RevealOnScrollDirective,
  ],
  templateUrl: './hero.component.html',
})
export class HeroComponent implements OnInit, OnDestroy {
  cvUrl?: string;

  heroContent: Hero | null = null;
  heroCardContent: HeroCard | null = null;

  title = '';
  subtitle = '';
  available = true;
  availabilityLabelKey = 'hero.availabilityAvailable';
  techBadges: HeroTechBadge[] = [];

  cardTitle = '';
  cardSubtitle = '';
  cardBadge = '';
  cardHighlight1 = '';
  cardHighlight2 = '';
  cardHighlight3 = '';
  cardStat1Label = '';
  cardStat1Value = '';
  cardStat2Label = '';
  cardStat2Value = '';
  cardStat3Label = '';
  cardStat3Value = '';

  isLoading = true;
  hasError = false;

  private heroRequestDone = false;
  private heroCardRequestDone = false;

  private readonly subscription = new Subscription();

  constructor(
    private heroContentApi: HeroContentApiService,
    private heroCardContentApi: HeroCardContentApiService,
    private resumeContentApi: ResumeContentApiService,
    private languageService: LanguageService,
    private translate: TranslateService,
    public logoIdentityService: LogoIdentityService
  ) {}

  ngOnInit(): void {
    this.loadHeroContent();
    this.loadHeroCardContent();
    this.loadResume();

    this.subscription.add(
      this.translate.onLangChange.subscribe(() => {
        this.applyLocalizedHeroContent();
        this.applyLocalizedHeroCardContent();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  scrollTo(id: 'projects' | 'contact'): void {
    const el = document.getElementById(id);
    if (!el) return;

    const offset = 90;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  trackByTechBadge(index: number, badge: HeroTechBadge): number | string {
    return badge.id ?? `${badge.label}-${index}`;
  }

  private loadHeroContent(): void {
    this.heroRequestDone = false;
    this.updateLoadingState();

    this.heroContentApi.get().subscribe({
      next: (hero) => {
        this.heroContent = hero;
        this.applyLocalizedHeroContent();
        this.heroRequestDone = true;
        this.updateLoadingState();
      },
      error: () => {
        this.heroContent = null;
        this.applyLocalizedHeroContent();
        this.hasError = true;
        this.heroRequestDone = true;
        this.updateLoadingState();
      },
    });
  }

  private loadHeroCardContent(): void {
    this.heroCardRequestDone = false;
    this.updateLoadingState();

    this.heroCardContentApi.get().subscribe({
      next: (heroCard) => {
        this.heroCardContent = heroCard;
        this.applyLocalizedHeroCardContent();
        this.heroCardRequestDone = true;
        this.updateLoadingState();
      },
      error: () => {
        this.heroCardContent = null;
        this.applyLocalizedHeroCardContent();
        this.hasError = true;
        this.heroCardRequestDone = true;
        this.updateLoadingState();
      },
    });
  }

  private loadResume(): void {
    this.resumeContentApi.get().subscribe({
      next: (resume) => {
        this.cvUrl = resolveMediaUrl(resume.fileUrl);
      },
      error: () => {
        this.cvUrl = undefined;
      },
    });
  }

  private applyLocalizedHeroContent(): void {
    if (!this.heroContent) {
      this.title = '';
      this.subtitle = '';
      this.available = true;
      this.availabilityLabelKey = 'hero.availabilityAvailable';
      this.techBadges = [];
      return;
    }

    const currentLanguage = this.languageService.current;

    this.title =
      currentLanguage === 'fr'
        ? this.heroContent.title.fr
        : this.heroContent.title.en;

    this.subtitle =
      currentLanguage === 'fr'
        ? this.heroContent.subtitle.fr
        : this.heroContent.subtitle.en;

    this.available = this.heroContent.available;
    this.availabilityLabelKey = this.available
      ? 'hero.availabilityAvailable'
      : 'hero.availabilityUnavailable';

    this.techBadges = [...(this.heroContent.techBadges ?? [])].sort(
      (a, b) => a.displayOrder - b.displayOrder
    );
  }

  private applyLocalizedHeroCardContent(): void {
    if (!this.heroCardContent) {
      this.cardTitle = '';
      this.cardSubtitle = '';
      this.cardBadge = '';
      this.cardHighlight1 = '';
      this.cardHighlight2 = '';
      this.cardHighlight3 = '';
      this.cardStat1Label = '';
      this.cardStat1Value = '';
      this.cardStat2Label = '';
      this.cardStat2Value = '';
      this.cardStat3Label = '';
      this.cardStat3Value = '';
      return;
    }

    const currentLanguage = this.languageService.current;

    this.cardTitle =
      currentLanguage === 'fr'
        ? this.heroCardContent.title.fr
        : this.heroCardContent.title.en;

    this.cardSubtitle =
      currentLanguage === 'fr'
        ? this.heroCardContent.subtitle.fr
        : this.heroCardContent.subtitle.en;

    this.cardBadge =
      currentLanguage === 'fr'
        ? this.heroCardContent.badge.fr
        : this.heroCardContent.badge.en;

    this.cardHighlight1 =
      currentLanguage === 'fr'
        ? this.heroCardContent.highlight1.fr
        : this.heroCardContent.highlight1.en;

    this.cardHighlight2 =
      currentLanguage === 'fr'
        ? this.heroCardContent.highlight2.fr
        : this.heroCardContent.highlight2.en;

    this.cardHighlight3 =
      currentLanguage === 'fr'
        ? this.heroCardContent.highlight3.fr
        : this.heroCardContent.highlight3.en;

    this.cardStat1Label =
      currentLanguage === 'fr'
        ? this.heroCardContent.stat1Label.fr
        : this.heroCardContent.stat1Label.en;

    this.cardStat1Value = this.heroCardContent.stat1Value;

    this.cardStat2Label =
      currentLanguage === 'fr'
        ? this.heroCardContent.stat2Label.fr
        : this.heroCardContent.stat2Label.en;

    this.cardStat2Value = this.heroCardContent.stat2Value;

    this.cardStat3Label =
      currentLanguage === 'fr'
        ? this.heroCardContent.stat3Label.fr
        : this.heroCardContent.stat3Label.en;

    this.cardStat3Value = this.heroCardContent.stat3Value;
  }

  private updateLoadingState(): void {
    this.isLoading = !(this.heroRequestDone && this.heroCardRequestDone);
  }
}