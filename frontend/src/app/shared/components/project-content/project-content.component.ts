import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { Project } from '../../../shared/models/project.model';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { LanguageService } from '../../../core/i18n/language.service';

@Component({
  selector: 'app-project-content',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ActionButtonComponent,
  ],
  templateUrl: './project-content.component.html',
})
export class ProjectContentComponent {
  @Input({ required: true }) project!: Project;
  @Input() compact = false;

  constructor(private lang: LanguageService) {}

  loc(value?: { fr?: string; en?: string } | null): string {
    if (!value) return '';

    const currentLang = this.lang.current;

    return value[currentLang] ?? value.fr ?? value.en ?? '';
  }
}