import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AppearanceSettings,
  AppearanceSettingsPayload,
} from '../../shared/models/appearance.model';
import { API_BASE_URL } from './api.config';

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
}