import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { LegalContent } from '../../shared/models/legal.model';

@Injectable({ providedIn: 'root' })
export class LegalContentApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  get(): Observable<LegalContent> {
    return this.http.get<LegalContent>(`${this.baseUrl}/api/public/legal`);
  }
}