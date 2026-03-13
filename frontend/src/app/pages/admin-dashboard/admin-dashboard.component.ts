import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AdminProjectsApiService } from '../../core/api/admin-projects-api.service';
import { AdminProject } from '../../core/auth/auth.models';
import { extractApiErrorMessage } from '../../core/api/api-error.utils';
import { ToastService } from '../../shared/services/toast.service';
import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';

type ProjectStatusFilter = 'all' | 'published' | 'draft';
type ProjectFeaturedFilter = 'all' | 'featured' | 'not-featured';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TextFieldComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  projects: AdminProject[] = [];
  isLoading = true;
  errorMessage = '';
  deletingProjectId: string | null = null;

  readonly searchControl = new FormControl('', { nonNullable: true });

  statusFilter: ProjectStatusFilter = 'all';
  featuredFilter: ProjectFeaturedFilter = 'all';

  constructor(
    private adminProjectsApi: AdminProjectsApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminProjectsApi.getAll().subscribe({
      next: (response) => {
        this.projects = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.projects = [];
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible de charger la liste des projets.'
        );
        this.toastService.error(this.errorMessage);
        this.isLoading = false;
      },
    });
  }

  deleteProject(project: AdminProject): void {
    const confirmed = window.confirm(
      `Confirmer la suppression du projet "${project.title}" ?`
    );

    if (!confirmed || !project.id) {
      return;
    }

    this.deletingProjectId = project.id;
    this.errorMessage = '';

    this.adminProjectsApi.delete(project.id).subscribe({
      next: () => {
        this.projects = this.projects.filter((item) => item.id !== project.id);
        this.deletingProjectId = null;
        this.toastService.success(`Projet "${project.title}" supprimé.`);
      },
      error: (error) => {
        this.errorMessage = extractApiErrorMessage(
          error,
          'La suppression du projet a échoué.'
        );
        this.toastService.error(this.errorMessage);
        this.deletingProjectId = null;
      },
    });
  }

  setStatusFilter(value: ProjectStatusFilter): void {
    this.statusFilter = value;
  }

  setFeaturedFilter(value: ProjectFeaturedFilter): void {
    this.featuredFilter = value;
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.statusFilter = 'all';
    this.featuredFilter = 'all';
  }

  trackByProjectId(_: number, project: AdminProject): string {
    return project.id;
  }

  get filteredProjects(): AdminProject[] {
    const search = this.searchControl.value.trim().toLowerCase();

    return [...this.projects]
      .filter((project) => {
        if (this.statusFilter === 'published') {
          return !!project.published;
        }

        if (this.statusFilter === 'draft') {
          return !project.published;
        }

        return true;
      })
      .filter((project) => {
        if (this.featuredFilter === 'featured') {
          return !!project.featured;
        }

        if (this.featuredFilter === 'not-featured') {
          return !project.featured;
        }

        return true;
      })
      .filter((project) => {
        if (!search) {
          return true;
        }

        const searchableContent = [
          project.title,
          project.slug,
          project.category,
          project.type,
          ...(project.stack ?? []),
          ...(project.tags ?? []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchableContent.includes(search);
      })
      .sort((a, b) => {
        const orderA = a.displayOrder ?? 0;
        const orderB = b.displayOrder ?? 0;

        if (orderA !== orderB) {
          return orderA - orderB;
        }

        return a.title.localeCompare(b.title);
      });
  }

  get publishedCount(): number {
    return this.projects.filter((project) => project.published).length;
  }

  get featuredCount(): number {
    return this.projects.filter((project) => project.featured).length;
  }

  get draftCount(): number {
    return this.projects.filter((project) => !project.published).length;
  }

  get resultCount(): number {
    return this.filteredProjects.length;
  }
}