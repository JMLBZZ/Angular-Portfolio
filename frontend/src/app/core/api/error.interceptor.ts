import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthStorageService } from '../auth/auth-storage.service';
import { ToastService } from '../../shared/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        const isLoginRequest = req.url.includes('/api/auth/login');

        if (!isLoginRequest) {
          authStorage.clearSession();
          toastService.warning(
            'Votre session admin a expiré. Veuillez vous reconnecter.'
          );
          router.navigate(['/admin/login']);
        }
      }

      return throwError(() => error);
    })
  );
};