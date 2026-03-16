import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

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
  confirmDeleteProjectId: string | null = null;

  isDeletingAllProjects = false;
  isConfirmDeleteAllOpen = false;

  isDeletingSelectedProjects = false;
  isConfirmDeleteSelectionOpen = false;

  readonly selectedProjectIds = new Set<string>();
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
        this.pruneSelection();
        this.isLoading = false;
      },
      error: (error) => {
        this.projects = [];
        this.selectedProjectIds.clear();
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible de charger la liste des projets.'
        );
        this.toastService.error(this.errorMessage);
        this.isLoading = false;
      },
    });
  }

  requestDelete(project: AdminProject): void {
    if (!project.id || this.isDeleteActionLocked) {
      return;
    }

    this.errorMessage = '';
    this.isConfirmDeleteAllOpen = false;
    this.isConfirmDeleteSelectionOpen = false;
    this.confirmDeleteProjectId = project.id;
  }

  cancelDelete(): void {
    if (this.isDeleteActionLocked) {
      return;
    }

    this.confirmDeleteProjectId = null;
  }

  confirmDelete(project: AdminProject): void {
    if (!project.id || this.isDeleteActionLocked) {
      return;
    }

    this.deletingProjectId = project.id;
    this.errorMessage = '';

    this.adminProjectsApi.delete(project.id).subscribe({
      next: () => {
        this.projects = this.projects.filter((item) => item.id !== project.id);
        this.selectedProjectIds.delete(project.id);
        this.deletingProjectId = null;
        this.confirmDeleteProjectId = null;
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

  requestDeleteAll(): void {
    if (this.isDeleteActionLocked || this.filteredProjects.length === 0) {
      return;
    }

    this.errorMessage = '';
    this.confirmDeleteProjectId = null;
    this.isConfirmDeleteSelectionOpen = false;
    this.isConfirmDeleteAllOpen = true;
  }

  cancelDeleteAll(): void {
    if (this.isDeleteActionLocked) {
      return;
    }

    this.isConfirmDeleteAllOpen = false;
  }

  confirmDeleteAll(): void {
    const projectsToDelete = this.filteredProjects.filter(
      (project): project is AdminProject & { id: string } => !!project.id
    );

    if (this.isDeleteActionLocked || projectsToDelete.length === 0) {
      return;
    }

    this.isDeletingAllProjects = true;
    this.errorMessage = '';

    forkJoin(
      projectsToDelete.map((project) =>
        this.adminProjectsApi.delete(project.id)
      )
    ).subscribe({
      next: () => {
        const idsToDelete = new Set(projectsToDelete.map((project) => project.id));
        this.projects = this.projects.filter(
          (project) => !project.id || !idsToDelete.has(project.id)
        );

        idsToDelete.forEach((id) => this.selectedProjectIds.delete(id));

        this.isDeletingAllProjects = false;
        this.isConfirmDeleteAllOpen = false;

        const count = projectsToDelete.length;
        this.toastService.success(
          count > 1
            ? `${count} projets ont été supprimés.`
            : '1 projet a été supprimé.'
        );
      },
      error: (error) => {
        this.errorMessage = extractApiErrorMessage(
          error,
          'La suppression groupée des projets a échoué.'
        );
        this.toastService.error(this.errorMessage);
        this.isDeletingAllProjects = false;
      },
    });
  }

  requestDeleteSelection(): void {
    if (this.isDeleteActionLocked || this.selectedFilteredProjects.length === 0) {
      return;
    }

    this.errorMessage = '';
    this.confirmDeleteProjectId = null;
    this.isConfirmDeleteAllOpen = false;
    this.isConfirmDeleteSelectionOpen = true;
  }

  cancelDeleteSelection(): void {
    if (this.isDeleteActionLocked) {
      return;
    }

    this.isConfirmDeleteSelectionOpen = false;
  }

  confirmDeleteSelection(): void {
    const projectsToDelete = this.selectedFilteredProjects.filter(
      (project): project is AdminProject & { id: string } => !!project.id
    );

    if (this.isDeleteActionLocked || projectsToDelete.length === 0) {
      return;
    }

    this.isDeletingSelectedProjects = true;
    this.errorMessage = '';

    forkJoin(
      projectsToDelete.map((project) =>
        this.adminProjectsApi.delete(project.id)
      )
    ).subscribe({
      next: () => {
        const idsToDelete = new Set(projectsToDelete.map((project) => project.id));
        this.projects = this.projects.filter(
          (project) => !project.id || !idsToDelete.has(project.id)
        );

        idsToDelete.forEach((id) => this.selectedProjectIds.delete(id));

        this.isDeletingSelectedProjects = false;
        this.isConfirmDeleteSelectionOpen = false;

        const count = projectsToDelete.length;
        this.toastService.success(
          count > 1
            ? `${count} projets sélectionnés ont été supprimés.`
            : '1 projet sélectionné a été supprimé.'
        );
      },
      error: (error) => {
        this.errorMessage = extractApiErrorMessage(
          error,
          'La suppression des projets sélectionnés a échoué.'
        );
        this.toastService.error(this.errorMessage);
        this.isDeletingSelectedProjects = false;
      },
    });
  }

  toggleProjectSelection(project: AdminProject, checked: boolean): void {
    if (!project.id || this.isDeleteActionLocked) {
      return;
    }

    if (checked) {
      this.selectedProjectIds.add(project.id);
    } else {
      this.selectedProjectIds.delete(project.id);
    }
  }

  toggleSelectAllFiltered(checked: boolean): void {
    if (this.isDeleteActionLocked) {
      return;
    }

    const selectableIds = this.filteredProjects
      .map((project) => project.id)
      .filter((id): id is string => !!id);

    if (checked) {
      selectableIds.forEach((id) => this.selectedProjectIds.add(id));
      return;
    }

    selectableIds.forEach((id) => this.selectedProjectIds.delete(id));
  }

  isProjectSelected(project: AdminProject): boolean {
    return !!project.id && this.selectedProjectIds.has(project.id);
  }

  setStatusFilter(value: ProjectStatusFilter): void {
    this.statusFilter = value;
    this.closeBulkConfirmations();
  }

  setFeaturedFilter(value: ProjectFeaturedFilter): void {
    this.featuredFilter = value;
    this.closeBulkConfirmations();
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.statusFilter = 'all';
    this.featuredFilter = 'all';
    this.closeBulkConfirmations();
  }

  trackByProjectId(_: number, project: AdminProject): string {
    return project.id;
  }

  isDeleteConfirmationOpen(project: AdminProject): boolean {
    return !!project.id && this.confirmDeleteProjectId === project.id;
  }

  isDeletingProject(project: AdminProject): boolean {
    return !!project.id && this.deletingProjectId === project.id;
  }

  get isDeletingAnyProject(): boolean {
    return this.deletingProjectId !== null;
  }

  get isDeleteActionLocked(): boolean {
    return (
      this.isDeletingAnyProject ||
      this.isDeletingAllProjects ||
      this.isDeletingSelectedProjects
    );
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

  get selectedFilteredProjects(): AdminProject[] {
    return this.filteredProjects.filter((project) =>
      project.id ? this.selectedProjectIds.has(project.id) : false
    );
  }

  get selectedCount(): number {
    return this.selectedFilteredProjects.length;
  }

  get areAllFilteredProjectsSelected(): boolean {
    const selectableIds = this.filteredProjects
      .map((project) => project.id)
      .filter((id): id is string => !!id);

    return selectableIds.length > 0 &&
      selectableIds.every((id) => this.selectedProjectIds.has(id));
  }

  get areSomeFilteredProjectsSelected(): boolean {
    return this.selectedCount > 0 && !this.areAllFilteredProjectsSelected;
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

  get canDeleteAllFilteredProjects(): boolean {
    return !this.isLoading && this.filteredProjects.length > 0;
  }

  get canDeleteSelectedProjects(): boolean {
    return !this.isLoading && this.selectedFilteredProjects.length > 0;
  }

  private pruneSelection(): void {
    const existingIds = new Set(
      this.projects.map((project) => project.id).filter((id): id is string => !!id)
    );

    for (const id of Array.from(this.selectedProjectIds)) {
      if (!existingIds.has(id)) {
        this.selectedProjectIds.delete(id);
      }
    }
  }

  private closeBulkConfirmations(): void {
    if (this.isDeleteActionLocked) {
      return;
    }

    this.isConfirmDeleteAllOpen = false;
    this.isConfirmDeleteSelectionOpen = false;
  }
}