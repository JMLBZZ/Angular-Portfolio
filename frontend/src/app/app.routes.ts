import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { pendingChangesGuard } from './core/auth/pending-changes.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/public-home/public-home-page.component').then(
        (m) => m.PublicHomePageComponent
      ),
  },
  {
    path: 'legal',
    loadComponent: () =>
      import('./pages/legal-page/legal-page.component').then(
        (m) => m.LegalPageComponent
      ),
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./pages/admin-login/admin-login.component').then(
        (m) => m.AdminLoginComponent
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/admin-projects/admin-projects.component').then(
            (m) => m.AdminProjectsComponent
          ),
      },
      {
        path: 'projects/new',
        loadComponent: () =>
          import('./pages/admin-project-form/admin-project-form.component').then(
            (m) => m.AdminProjectFormComponent
          ),
        canDeactivate: [pendingChangesGuard],
      },
      {
        path: 'projects/:id/edit',
        loadComponent: () =>
          import('./pages/admin-project-form/admin-project-form.component').then(
            (m) => m.AdminProjectFormComponent
          ),
        canDeactivate: [pendingChangesGuard],
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/admin-contact/admin-contact.component').then(
            (m) => m.AdminContactComponent
          ),
        canDeactivate: [pendingChangesGuard],
      },
      {
        path: 'hero',
        loadComponent: () =>
          import('./pages/admin-hero/admin-hero.component').then(
            (m) => m.AdminHeroComponent
          ),
        canDeactivate: [pendingChangesGuard],
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/admin-about/admin-about.component').then(
            (m) => m.AdminAboutComponent
          ),
        canDeactivate: [pendingChangesGuard],
      },
      {
        path: 'resume',
        loadComponent: () =>
          import('./pages/admin-resume/admin-resume.component').then(
            (m) => m.AdminResumeComponent
          ),
        canDeactivate: [pendingChangesGuard],
      },
      {
        path: 'legal',
        loadComponent: () =>
          import('./pages/admin-legal/admin-legal.component').then(
            (m) => m.AdminLegalComponent
          ),
        canDeactivate: [pendingChangesGuard],
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./pages/admin-messages/admin-messages.component').then(
            (m) => m.AdminMessagesComponent
          ),
      },
      {
        path: 'appearance',
        loadComponent: () =>
          import('./pages/admin-appearance/admin-appearance.component').then(
            (m) => m.AdminAppearanceComponent
          ),
        canDeactivate: [pendingChangesGuard],
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('./pages/project-detail/project-detail-page.component').then(
        (m) => m.ProjectDetailPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];