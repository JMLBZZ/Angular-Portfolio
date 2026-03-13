import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { PublicHomePageComponent } from './pages/public-home/public-home-page.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminProjectFormComponent } from './pages/admin-project-form/admin-project-form.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicHomePageComponent,
  },
  {
    path: 'admin/login',
    component: AdminLoginComponent,
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
      },
      {
        path: 'projects/new',
        component: AdminProjectFormComponent,
      },
      {
        path: 'projects/:id/edit',
        component: AdminProjectFormComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];