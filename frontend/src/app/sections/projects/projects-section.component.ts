import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PROJECTS, Project, ProjectCategory } from './projects.data';

type Filter = 'all' | ProjectCategory;

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './projects-section.component.html',
  styleUrls: ['./projects-section.component.css'],
})
export class ProjectsSectionComponent {

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
}