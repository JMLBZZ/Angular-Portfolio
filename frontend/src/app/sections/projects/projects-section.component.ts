import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { PROJECTS, Project, ProjectCategory, LocalizedText } from './projects.data';
import { LanguageService } from '../../core/i18n/language.service';

type Filter = 'all' | ProjectCategory;

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './projects-section.component.html',
  styleUrls: ['./projects-section.component.css'],
})
export class ProjectsSectionComponent {

  @Output() projectClick = new EventEmitter<Project>();

  constructor(private lang: LanguageService) {}

  filters: { label: string; value: Filter }[] = [
    { label: 'projects.filters.all', value: 'all' },
    { label: 'projects.filters.front', value: 'front' },
    { label: 'projects.filters.back', value: 'back' },
    { label: 'projects.filters.fullstack', value: 'fullstack' },
    { label: 'projects.filters.uiux', value: 'uiux' },
    { label: 'projects.filters.pao', value: 'pao' },
    { label: 'projects.filters.other', value: 'other' },
  ];

  activeFilter: Filter = 'all';

  projects = PROJECTS;

  get filteredProjects(): Project[] {
    if (this.activeFilter === 'all') return this.projects;
    return this.projects.filter(p => p.category === this.activeFilter);
  }

  setFilter(filter: Filter) {
    this.activeFilter = filter;
  }

  openProject(project: Project) {
    this.projectClick.emit(project);
  }

  loc(text: LocalizedText | undefined): string {
    if (!text) return '';
    const currentLang = this.lang.current;
    return text[currentLang] ?? text.fr;
  }
}