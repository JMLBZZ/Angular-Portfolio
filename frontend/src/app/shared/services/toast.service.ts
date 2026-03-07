import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastItem, ToastType } from '../models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<ToastItem[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();

  private toastIdCounter = 0;

  show(type: ToastType, message: string, duration = 5000): void {
    const id = this.generateId();

    const toast: ToastItem = {
      id,
      type,
      message,
      duration,
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    if (duration > 0) {
      window.setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, duration = 5000): void {
    this.show('success', message, duration);
  }

  error(message: string, duration = 5000): void {
    this.show('error', message, duration);
  }

  info(message: string, duration = 5000): void {
    this.show('info', message, duration);
  }

  warning(message: string, duration = 5000): void {
    this.show('warning', message, duration);
  }

  remove(id: string): void {
    const updatedToasts = this.toastsSubject.value.filter((toast) => toast.id !== id);
    this.toastsSubject.next(updatedToasts);
  }

  clear(): void {
    this.toastsSubject.next([]);
  }

  private generateId(): string {
    this.toastIdCounter += 1;
    return `toast-${this.toastIdCounter}`;
  }
}