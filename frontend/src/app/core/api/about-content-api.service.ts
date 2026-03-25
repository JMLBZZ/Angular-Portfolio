import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { AboutContent } from '../../shared/models/about.model';

@Injectable({ providedIn: 'root' })
export class AboutContentApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  get(): Observable<AboutContent> {
    return this.http.get<AboutContent>(`${this.baseUrl}/api/public/about`);
  }
}