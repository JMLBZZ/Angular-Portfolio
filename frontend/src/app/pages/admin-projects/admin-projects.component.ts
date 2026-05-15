import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { AdminProjectsApiService } from '../../core/api/admin-projects-api.service';
import { AdminProject, AdminProjectPayload } from '../../core/auth/auth.models';
import { extractApiErrorMessage } from '../../core/api/api-error.utils';
import { ToastService } from '../../shared/services/toast.service';
import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';

type ProjectStatusFilter = 'all' | 'published' | 'draft';
type ProjectFeaturedFilter = 'all' | 'featured' | 'not-featured';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TextFieldComponent,
    DragDropModule,
  ],
  templateUrl: './admin-projects.component.html',
})
export class AdminProjectsComponent implements OnInit, AfterViewInit {
  projects: AdminProject[] = [];
  isLoading = true;
  errorMessage = '';

  deletingProjectId: string | null = null;
  confirmDeleteProjectId: string | null = null;

  isDeletingAllProjects = false;
  isConfirmDeleteAllOpen = false;

  isDeletingSelectedProjects = false;
  isConfirmDeleteSelectionOpen = false;

  isDuplicatingProjectId: string | null = null;

  isReordering = false;

  readonly selectedProjectIds = new Set<string>();
  readonly searchControl = new FormControl('', { nonNullable: true });

  statusFilter: ProjectStatusFilter = 'all';
  featuredFilter: ProjectFeaturedFilter = 'all';

  private pendingFocusProjectId: string | null = null;

  constructor(
    private adminProjectsApi: AdminProjectsApiService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      this.pendingFocusProjectId = this.extractProjectIdFromFragment(fragment);
      this.tryFocusPendingProject();
    });

    this.loadProjects();
  }

  ngAfterViewInit(): void {
    this.tryFocusPendingProject();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminProjectsApi.getAll().subscribe({
      next: (response) => {
        this.projects = this.sortProjects(response.data);
        this.pruneSelection();
        this.isLoading = false;
        this.tryFocusPendingProject();
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

  onProjectDrop(event: CdkDragDrop<AdminProject[]>): void {
    if (!this.canReorderProjects || event.previousIndex === event.currentIndex) {
      return;
    }

    const reorderedProjects = [...this.filteredProjects];
    moveItemInArray(reorderedProjects, event.previousIndex, event.currentIndex);

    const displayOrderStart = reorderedProjects.length - 1;

    const optimisticProjects = reorderedProjects.map((project, index) => ({
      ...project,
      displayOrder: displayOrderStart - index,
    }));

    const previousProjects = [...this.projects];
    this.projects = optimisticProjects;
    this.isReordering = true;
    this.errorMessage = '';

    const projectIds = optimisticProjects
      .map((project) => project.id)
      .filter((id): id is string => !!id);

    this.adminProjectsApi.reorder(projectIds).subscribe({
      next: (projects) => {
        this.projects = this.sortProjects(projects);
        this.isReordering = false;
        this.toastService.success('Ordre des projets mis à jour.');
      },
      error: (error) => {
        this.projects = previousProjects;
        this.isReordering = false;
        this.errorMessage = extractApiErrorMessage(
          error,
          'La réorganisation des projets a échoué.'
        );
        this.toastService.error(this.errorMessage);
      },
    });
  }

  duplicateProject(project: AdminProject): void {
    if (!project.id || this.isActionLocked) {
      return;
    }

    this.errorMessage = '';
    this.isDuplicatingProjectId = project.id;

    const payload = this.buildDuplicatePayload(project);

    this.adminProjectsApi.create(payload).subscribe({
      next: (createdProject) => {
        this.projects = this.sortProjects([createdProject, ...this.projects]);
        this.isDuplicatingProjectId = null;
        this.toastService.success(`Projet "${project.title}" dupliqué.`);
      },
      error: (error) => {
        this.errorMessage = extractApiErrorMessage(
          error,
          'La duplication du projet a échoué.'
        );
        this.toastService.error(this.errorMessage);
        this.isDuplicatingProjectId = null;
      },
    });
  }

  requestDelete(project: AdminProject): void {
    if (!project.id || this.isActionLocked) {
      return;
    }

    this.errorMessage = '';
    this.isConfirmDeleteAllOpen = false;
    this.isConfirmDeleteSelectionOpen = false;
    this.confirmDeleteProjectId = project.id;
  }

  cancelDelete(): void {
    if (this.isActionLocked) {
      return;
    }

    this.confirmDeleteProjectId = null;
  }

  confirmDelete(project: AdminProject): void {
    if (!project.id || this.isActionLocked) {
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
    if (this.isActionLocked || this.filteredProjects.length === 0) {
      return;
    }

    this.errorMessage = '';
    this.confirmDeleteProjectId = null;
    this.isConfirmDeleteSelectionOpen = false;
    this.isConfirmDeleteAllOpen = true;
  }

  cancelDeleteAll(): void {
    if (this.isActionLocked) {
      return;
    }

    this.isConfirmDeleteAllOpen = false;
  }

  confirmDeleteAll(): void {
    const projectsToDelete = this.filteredProjects.filter(
      (project): project is AdminProject & { id: string } => !!project.id
    );

    if (this.isActionLocked || projectsToDelete.length === 0) {
      return;
    }

    this.isDeletingAllProjects = true;
    this.errorMessage = '';

    forkJoin(projectsToDelete.map((project) => this.adminProjectsApi.delete(project.id))).subscribe({
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
    if (this.isActionLocked || this.selectedFilteredProjects.length === 0) {
      return;
    }

    this.errorMessage = '';
    this.confirmDeleteProjectId = null;
    this.isConfirmDeleteAllOpen = false;
    this.isConfirmDeleteSelectionOpen = true;
  }

  cancelDeleteSelection(): void {
    if (this.isActionLocked) {
      return;
    }

    this.isConfirmDeleteSelectionOpen = false;
  }

  confirmDeleteSelection(): void {
    const projectsToDelete = this.selectedFilteredProjects.filter(
      (project): project is AdminProject & { id: string } => !!project.id
    );

    if (this.isActionLocked || projectsToDelete.length === 0) {
      return;
    }

    this.isDeletingSelectedProjects = true;
    this.errorMessage = '';

    forkJoin(projectsToDelete.map((project) => this.adminProjectsApi.delete(project.id))).subscribe({
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
    if (!project.id || this.isActionLocked) {
      return;
    }

    if (checked) {
      this.selectedProjectIds.add(project.id);
    } else {
      this.selectedProjectIds.delete(project.id);
    }
  }

  toggleSelectAllFiltered(checked: boolean): void {
    if (this.isActionLocked) {
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

  isDuplicatingProject(project: AdminProject): boolean {
    return !!project.id && this.isDuplicatingProjectId === project.id;
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

  getProjectFragment(project: AdminProject): string {
    return `project-${project.id}`;
  }

  get isDeletingAnyProject(): boolean {
    return this.deletingProjectId !== null;
  }

  get isDeleteActionLocked(): boolean {
    return (
      this.isDeletingAnyProject ||
      this.isDeletingAllProjects ||
      this.isDeletingSelectedProjects ||
      this.isDuplicatingProjectId !== null
    );
  }

  get isActionLocked(): boolean {
    return this.isDeleteActionLocked || this.isReordering;
  }

  get hasActiveFilters(): boolean {
    return (
      this.searchControl.value.trim().length > 0 ||
      this.statusFilter !== 'all' ||
      this.featuredFilter !== 'all'
    );
  }

  get canReorderProjects(): boolean {
    return !this.isLoading && !this.isActionLocked && !this.hasActiveFilters;
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
      .sort((a, b) => this.compareProjects(a, b));
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
    if (this.isActionLocked) {
      return;
    }

    this.isConfirmDeleteAllOpen = false;
    this.isConfirmDeleteSelectionOpen = false;
  }

  private sortProjects(projects: AdminProject[]): AdminProject[] {
    return [...projects].sort((a, b) => this.compareProjects(a, b));
  }

  private compareProjects(a: AdminProject, b: AdminProject): number {
    const orderA = a.displayOrder ?? 0;
    const orderB = b.displayOrder ?? 0;

    if (orderA !== orderB) {
      return orderB - orderA;
    }

    return a.title.localeCompare(b.title);
  }

  private buildDuplicatePayload(project: AdminProject): AdminProjectPayload {
    const duplicatedTitle = this.buildDuplicateTitle(project.title);
    const duplicatedSlug = this.buildDuplicateSlug(project.slug);

    return {
      slug: duplicatedSlug,
      title: duplicatedTitle,
      category: project.category,
      image: project.image,
      cover: project.cover,
      images: [...(project.images ?? [])],
      description: project.description,
      longDescription: project.longDescription,
      stack: [...(project.stack ?? [])],
      type: project.type,
      featured: project.featured,
      role: project.role,
      problem: project.problem,
      solution: project.solution,
      demoUrl: project.demoUrl,
      tags: [...(project.tags ?? [])],
      githubUrl: project.githubUrl,
      showGithub: project.showGithub,
      published: project.published,
    };
  }

  private buildDuplicateTitle(originalTitle: string): string {
    const baseTitle = originalTitle?.trim() || 'Projet sans titre';
    const copySuffix = ' (copie)';

    if (!this.projects.some((project) => project.title === `${baseTitle}${copySuffix}`)) {
      return `${baseTitle}${copySuffix}`;
    }

    let index = 2;
    let candidate = `${baseTitle}${copySuffix} ${index}`;

    while (this.projects.some((project) => project.title === candidate)) {
      index++;
      candidate = `${baseTitle}${copySuffix} ${index}`;
    }

    return candidate;
  }

  private buildDuplicateSlug(originalSlug: string): string {
    const baseSlug = (originalSlug?.trim() || 'projet').replace(/-copie(?:-\d+)?$/, '');
    let candidate = `${baseSlug}-copie`;

    if (!this.projects.some((project) => project.slug === candidate)) {
      return candidate;
    }

    let index = 2;
    candidate = `${baseSlug}-copie-${index}`;

    while (this.projects.some((project) => project.slug === candidate)) {
      index++;
      candidate = `${baseSlug}-copie-${index}`;
    }

    return candidate;
  }

  private extractProjectIdFromFragment(fragment: string | null): string | null {
    if (!fragment || !fragment.startsWith('project-')) {
      return null;
    }

    return fragment.replace('project-', '').trim() || null;
  }

  private tryFocusPendingProject(): void {
    if (!this.pendingFocusProjectId || this.isLoading) {
      return;
    }

    const targetId = `project-${this.pendingFocusProjectId}`;

    setTimeout(() => {
      const element = this.document.getElementById(targetId) as HTMLElement | null;

      if (!element) {
        return;
      }

      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus({ preventScroll: true });
      this.pendingFocusProjectId = null;
    }, 0);
  }
}