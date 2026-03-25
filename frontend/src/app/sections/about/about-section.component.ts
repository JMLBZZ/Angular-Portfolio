import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { PillComponent } from '../../shared/components/pill/pill.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';

import { ResumeContentApiService } from '../../core/api/resume-content-api.service';
import { resolveMediaUrl } from '../../core/api/media-url.utils';
import { AboutContentApiService } from '../../core/api/about-content-api.service';
import { LanguageService } from '../../core/i18n/language.service';
import { AboutContent } from '../../shared/models/about.model';
import { LocalizedText } from '../../shared/models/project.model';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RevealOnScrollDirective,
    PillComponent,
    PrimaryButtonComponent,
  ],
  templateUrl: './about-section.component.html',
})
export class AboutSectionComponent implements OnInit, OnDestroy {
  avatarUrl = '/assets/about/avatar.png';

  cvUrl?: string;
  aboutContent: AboutContent | null = null;

  profileName = '';
  profileRole = '';
  profileLocation = '';
  profileBio = '';

  timelineItems: Array<{
    date: string;
    company: string;
    title: string;
    description: string;
    icon: 'work' | 'education';
  }> = [];

  skillGroups: Array<{
    title: string;
    items: Array<{
      name: string;
      value: number;
    }>;
  }> = [];

  softSkills: string[] = [];

  private readonly subscription = new Subscription();

  constructor(
    private resumeContentApi: ResumeContentApiService,
    private aboutContentApi: AboutContentApiService,
    public languageService: LanguageService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadResume();
    this.loadAboutContent();

    this.subscription.add(
      this.translateService.onLangChange.subscribe(() => {
        this.applyLocalizedContent();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  trackByIndex(index: number): number {
    return index;
  }

  /** Ouvre le CV dans un nouvel onglet */
  downloadCv(): void {
    if (!this.cvUrl) {
      return;
    }

    window.open(this.cvUrl, '_blank', 'noopener');
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

  private loadAboutContent(): void {
    this.aboutContentApi.get().subscribe({
      next: (aboutContent) => {
        this.aboutContent = aboutContent;
        this.applyLocalizedContent();
      },
      error: () => {
        this.aboutContent = null;
        this.profileName = '';
        this.profileRole = '';
        this.profileLocation = '';
        this.profileBio = '';
        this.timelineItems = [];
        this.skillGroups = [];
        this.softSkills = [];
      },
    });
  }

  private applyLocalizedContent(): void {
    if (!this.aboutContent) {
      return;
    }

    this.profileName = this.aboutContent.profileName;
    this.profileRole = this.localize(this.aboutContent.profileRole);
    this.profileLocation = this.localize(this.aboutContent.location);
    this.profileBio = this.localize(this.aboutContent.bio);

    this.timelineItems = (this.aboutContent.timelineItems ?? []).map((item) => ({
      date: this.localize(item.date),
      company: this.localize(item.company),
      title: this.localize(item.title),
      description: this.localize(item.description),
      icon: item.icon,
    }));

    this.skillGroups = (this.aboutContent.skillGroups ?? []).map((group) => ({
      title: this.localize(group.title),
      items: [...(group.items ?? [])],
    }));

    this.softSkills = (this.aboutContent.softSkills ?? []).map((skill) =>
      this.localize(skill)
    );
  }

  private localize(value: LocalizedText | null | undefined): string {
    if (!value) {
      return '';
    }

    return this.languageService.current === 'fr' ? value.fr : value.en;
  }
}