import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { Hero } from '../../shared/models/hero.model';

@Injectable({ providedIn: 'root' })
export class AdminHeroApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  get(): Observable<Hero> {
    return this.http.get<Hero>(`${this.baseUrl}/api/admin/hero`);
  }

  update(payload: Hero): Observable<Hero> {
    return this.http.put<Hero>(`${this.baseUrl}/api/admin/hero`, payload);
  }
}