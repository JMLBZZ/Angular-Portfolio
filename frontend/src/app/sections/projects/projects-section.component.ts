import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

import { ProjectsApiService } from '../../core/api/projects-api.service';
import { LanguageService } from '../../core/i18n/language.service';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import { FallbackImageDirective } from '../../shared/directives/fallback-image.directive';
import { Project, ProjectCategory, LocalizedText } from '../../shared/models/project.model';

type Filter = 'all' | ProjectCategory;

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterLink,
    ActionButtonComponent,
    FallbackImageDirective,
  ],
  templateUrl: './projects-section.component.html',
  styleUrls: ['./projects-section.component.css'],
})
export class ProjectsSectionComponent implements OnInit {
  @Output() projectClick = new EventEmitter<Project>();

  private readonly initialVisibleCount = 6;
  private readonly visibleStep = 6;

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

  visibleCount = this.initialVisibleCount;

  private imageLoadedState: Record<string, boolean> = {};
  private imageErrorState: Record<string, boolean> = {};

  ngOnInit(): void {
    this.loadProjects();
  }

  get filteredProjects(): Project[] {
    if (this.activeFilter === 'all') {
      return this.projects;
    }

    return this.projects.filter((project) => project.category === this.activeFilter);
  }

  get visibleProjects(): Project[] {
    return this.filteredProjects.slice(0, this.visibleCount);
  }

  get displayedProjectsCount(): number {
    return this.visibleProjects.length;
  }

  get hiddenProjectsCount(): number {
    return Math.max(0, this.filteredProjects.length - this.displayedProjectsCount);
  }

  get canShowMore(): boolean {
    return this.hiddenProjectsCount > 0;
  }

  setFilter(filter: Filter): void {
    this.activeFilter = filter;
    this.resetVisibleProjects();
  }

  showMoreProjects(): void {
    this.visibleCount += this.visibleStep;
  }

  openProject(project: Project): void {
    this.projectClick.emit(project);
  }

  loc(text: LocalizedText | undefined): string {
    if (!text) {
      return '';
    }

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

  private resetVisibleProjects(): void {
    this.visibleCount = this.initialVisibleCount;
  }

  private loadProjects(): void {
    this.isLoading = true;
    this.hasError = false;

    this.projectsApi.getPublishedProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.resetVisibleProjects();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets publics :', error);
        this.projects = [];
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }
}