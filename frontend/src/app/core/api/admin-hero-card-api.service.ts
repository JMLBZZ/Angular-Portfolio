import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { HeroCard } from '../../shared/models/hero-card.model';

@Injectable({ providedIn: 'root' })
export class AdminHeroCardApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  get(): Observable<HeroCard> {
    return this.http.get<HeroCard>(`${this.baseUrl}/api/admin/hero-card`);
  }

  update(payload: HeroCard): Observable<HeroCard> {
    return this.http.put<HeroCard>(`${this.baseUrl}/api/admin/hero-card`, payload);
  }
}