import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastItem } from '../../models/toast.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
})
export class ToastContainerComponent {
  readonly toasts$: Observable<ToastItem[]> = this.toastService.toasts$;

  constructor(private toastService: ToastService) {}

  removeToast(id: string): void {
    this.toastService.remove(id);
  }

  trackByToastId(_: number, toast: ToastItem): string {
    return toast.id;
  }

  getToastClasses(type: ToastItem['type']): string {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
      case 'error':
        return 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300';
      case 'warning':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300';
      case 'info':
      default:
        return 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300';
    }
  }

  getIconClass(type: ToastItem['type']): string {
    switch (type) {
      case 'success':
        return 'bi bi-check-circle-fill';
      case 'error':
        return 'bi bi-exclamation-triangle-fill';
      case 'warning':
        return 'bi bi-exclamation-circle-fill';
      case 'info':
      default:
        return 'bi bi-info-circle-fill';
    }
  }
}