import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { Project, ProjectCategory, LocalizedText } from '../../shared/models/project.model';
import { LanguageService } from '../../core/i18n/language.service';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import { ProjectsApiService } from '../../core/api/projects-api.service';

type Filter = 'all' | ProjectCategory;

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ActionButtonComponent,
  ],
  templateUrl: './projects-section.component.html',
  styleUrls: ['./projects-section.component.css'],
})
export class ProjectsSectionComponent implements OnInit {

  @Output() projectClick = new EventEmitter<Project>();

  constructor(
    private lang: LanguageService,
    private projectsApi: ProjectsApiService
  ) {}

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

  projects: Project[] = [];

  isLoading = true;
  hasError = false;

  private imageLoadedState: Record<string, boolean> = {};
  private imageErrorState: Record<string, boolean> = {};

  ngOnInit(): void {
    this.loadProjects();
  }

  get filteredProjects(): Project[] {
    if (this.activeFilter === 'all') return this.projects;
    return this.projects.filter((p) => p.category === this.activeFilter);
  }

  setFilter(filter: Filter): void {
    this.activeFilter = filter;
  }

  openProject(project: Project): void {
    this.projectClick.emit(project);
  }

  loc(text: LocalizedText | undefined): string {
    if (!text) return '';
    const currentLang = this.lang.current;
    return text[currentLang] ?? text.fr;
  }

  onImageLoad(project: Project): void {
    this.imageLoadedState[project.slug] = true;
    this.imageErrorState[project.slug] = false;
  }

  onImageError(project: Project): void {
    this.imageLoadedState[project.slug] = false;
    this.imageErrorState[project.slug] = true;
  }

  isImageLoaded(project: Project): boolean {
    return !!this.imageLoadedState[project.slug];
  }

  hasImageError(project: Project): boolean {
    return !!this.imageErrorState[project.slug];
  }

  private loadProjects(): void {
    this.isLoading = true;
    this.hasError = false;

    this.projectsApi.getPublishedProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets publics :', error);
        this.projects = [];
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }
}