import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AdminProjectsApiService } from '../../core/api/admin-projects-api.service';
import { AdminProject } from '../../core/auth/auth.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  projects: AdminProject[] = [];
  isLoading = true;
  errorMessage = '';
  deletingProjectId: string | null = null;

  constructor(private adminProjectsApi: AdminProjectsApiService) {}

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
      error: () => {
        this.projects = [];
        this.errorMessage = 'Impossible de charger la liste des projets.';
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

    this.adminProjectsApi.delete(project.id).subscribe({
      next: () => {
        this.projects = this.projects.filter((item) => item.id !== project.id);
        this.deletingProjectId = null;
      },
      error: () => {
        this.errorMessage = 'La suppression du projet a échoué.';
        this.deletingProjectId = null;
      },
    });
  }

  trackByProjectId(_: number, project: AdminProject): string {
    return project.id;
  }

  get publishedCount(): number {
    return this.projects.filter((project) => project.published).length;
  }

  get featuredCount(): number {
    return this.projects.filter((project) => project.featured).length;
  }
}