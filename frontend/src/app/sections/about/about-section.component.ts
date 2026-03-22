import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { PillComponent } from '../../shared/components/pill/pill.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';

import {
  ABOUT_SKILL_GROUPS,
  ABOUT_SOFT_SKILLS_KEYS,
  ABOUT_TIMELINE,
  SkillGroup,
  TimelineItem,
} from './about.data';
import { ResumeContentApiService } from '../../core/api/resume-content-api.service';
import { resolveMediaUrl } from '../../core/api/media-url.utils';

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
export class AboutSectionComponent implements OnInit {
  avatarUrl = '/assets/about/avatar.png';

  cvUrl?: string;

  timeline: TimelineItem[] = ABOUT_TIMELINE;
  skillGroups: SkillGroup[] = ABOUT_SKILL_GROUPS;
  softSkillsKeys: string[] = ABOUT_SOFT_SKILLS_KEYS;

  constructor(
    private resumeContentApi: ResumeContentApiService
  ) {}

  ngOnInit(): void {
    this.loadResume();
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
}