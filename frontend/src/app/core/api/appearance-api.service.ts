import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppearanceSettings } from '../../shared/models/appearance.model';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class AppearanceApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  get(): Observable<AppearanceSettings> {
    return this.http.get<AppearanceSettings>(`${this.baseUrl}/api/public/appearance`);
  }
}