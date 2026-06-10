import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  AppearanceSettings,
  AppearanceSettingsPayload,
} from '../../shared/models/appearance.model';
import { API_BASE_URL } from './api.config';

interface UploadedLogoResponse {
  url: string;
}

@Injectable({ providedIn: 'root' })
export class AdminAppearanceApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  get(): Observable<AppearanceSettings> {
    return this.http.get<AppearanceSettings>(`${this.baseUrl}/api/admin/appearance`);
  }

  update(payload: AppearanceSettingsPayload): Observable<AppearanceSettings> {
    return this.http.put<AppearanceSettings>(`${this.baseUrl}/api/admin/appearance`, payload);
  }

  reset(): Observable<AppearanceSettings> {
    return this.http.post<AppearanceSettings>(`${this.baseUrl}/api/admin/appearance/reset`, {});
  }

  uploadLogo(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<UploadedLogoResponse>(
        `${this.baseUrl}/api/admin/appearance/logo`,
        formData
      )
      .pipe(map((response) => response.url));
  }
}