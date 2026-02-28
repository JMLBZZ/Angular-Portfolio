import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

import {
  ABOUT_SKILL_GROUPS,
  ABOUT_SOFT_SKILLS_KEYS,
  ABOUT_TIMELINE,
  SkillGroup,
  TimelineItem,
} from './about.data';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule, TranslateModule, RevealOnScrollDirective],
  templateUrl: './about-section.component.html',
  styleUrls: ['./about-section.component.css'],
})
export class AboutSectionComponent {
  avatarUrl = '/assets/about/avatar.png';

  cvUrl = '/assets/cv/cv-jamel-bouazza.pdf';
  cvFileName = 'CV-Jamel-BOUAZZA.pdf';

  timeline: TimelineItem[] = ABOUT_TIMELINE;
  skillGroups: SkillGroup[] = ABOUT_SKILL_GROUPS;
  softSkillsKeys: string[] = ABOUT_SOFT_SKILLS_KEYS;

  trackByIndex(index: number): number {
    return index;
  }
}