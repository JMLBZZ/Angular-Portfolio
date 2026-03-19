import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { HeroCard } from '../../shared/models/hero-card.model';

@Injectable({ providedIn: 'root' })
export class HeroCardContentApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  get(): Observable<HeroCard> {
    return this.http.get<HeroCard>(`${this.baseUrl}/api/public/hero-card`);
  }
}