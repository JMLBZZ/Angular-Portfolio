import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  get email(): string {
    return this.authService.getUserEmail() ?? 'admin';
  }

  logout(): void {
    this.authService.logout();
    this.toastService.info('Vous avez été déconnecté.');
    this.router.navigate(['/admin/login']);
  }
}