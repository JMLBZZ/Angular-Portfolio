import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthStorageService } from './auth-storage.service';
import { API_BASE_URL } from '../api/api.config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStorage = inject(AuthStorageService);
  const token = authStorage.getAccessToken();

  const isLocalBackendRequest =
    API_BASE_URL !== '' && req.url.startsWith(API_BASE_URL);

  const isRelativeApiRequest =
    API_BASE_URL === '' && req.url.startsWith('/api/');

  const isBackendRequest = isLocalBackendRequest || isRelativeApiRequest;

  if (!isBackendRequest || !token) {
    return next(req);
  }

  const authorizedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authorizedRequest);
};